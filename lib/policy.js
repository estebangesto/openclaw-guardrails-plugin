export const defaultRules = [
  ["prompt_injection", /ignore (all |previous |prior )?(instructions|rules)|system prompt|developer message|jailbreak/i],
  ["secrets", /api[ _-]?key|password|token|credential|secret|\.env|private key|claves? (que )?(tengas )?(guardadas?|almacenadas?)|credenciales? (guardadas?|almacenadas?)|secretos? (guardados?|almacenados?)/i],
  ["admin_action", /sudo\b|docker\b|systemctl\b|chmod\b|ssh\b|delete (all|files|data)|borrar (todo|archivos|datos)/i]
];

export function matchRules(content, rules = defaultRules) {
  const text = String(content ?? "");
  return rules.filter(([, expression]) => expression.test(text)).map(([name]) => name);
}

export function shouldBlock(matches, mode, blockedRules) {
  return mode === "block" && matches.some((rule) => blockedRules.has(rule));
}
