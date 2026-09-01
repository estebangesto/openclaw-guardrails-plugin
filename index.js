import { appendFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { matchRules, shouldBlock } from "./lib/policy.js";

const defaultLogFile = join(process.env.OPENCLAW_HOME ?? join(homedir(), ".openclaw"), "guardrails-audit.jsonl");

function readConfig(value) {
  const config = value && typeof value === "object" ? value : {};
  return {
    inboundMode: config.inboundMode === "audit" ? "audit" : "block",
    outboundMode: config.outboundMode === "block" ? "block" : "audit",
    blockedRules: new Set(Array.isArray(config.blockedRules) ? config.blockedRules : ["secrets"]),
    logFile: typeof config.logFile === "string" && config.logFile ? config.logFile : defaultLogFile
  };
}

async function audit(logFile, direction, content, context) {
  const matches = matchRules(content);
  const entry = {
    ts: new Date().toISOString(),
    direction,
    matches,
    channel: context.channelId,
    sessionKey: context.sessionKey
  };
  try {
    await appendFile(logFile, `${JSON.stringify(entry)}\n`, { encoding: "utf8" });
  } catch {
    // El logging nunca debe impedir el procesamiento ni modificar la decisión.
  }
  return matches;
}

export default definePluginEntry({
  id: "openclaw-guardrails",
  name: "OpenClaw Guardrails",
  description: "Políticas deterministas de entrada y salida para OpenClaw.",
  register(api) {
    const config = readConfig(api.pluginConfig);

    api.on("before_agent_run", async (event, ctx) => {
      const matches = await audit(config.logFile, "pre_agent", event.prompt, ctx);
      if (shouldBlock(matches, config.inboundMode, config.blockedRules)) {
        return {
          outcome: "block",
          reason: "guardrail policy matched",
          message: "Solicitud bloqueada por la política de seguridad del asistente.",
          category: matches.find((rule) => config.blockedRules.has(rule))
        };
      }
    }, { priority: 100, timeoutMs: 1500 });

    api.on("message_received", async (event, ctx) => {
      await audit(config.logFile, "inbound", event.content, ctx);
    }, { priority: 100, timeoutMs: 1500 });

    api.on("message_sending", async (event, ctx) => {
      const matches = await audit(config.logFile, "outbound", event.content, ctx);
      if (shouldBlock(matches, config.outboundMode, config.blockedRules)) {
        return { cancel: true, cancelReason: "guardrail policy matched" };
      }
    }, { priority: 100, timeoutMs: 1500 });
  }
});
