# Contribuir a OpenClaw Guardrails Plugin

Gracias por colaborar con este plugin de referencia para aplicar guardrails deterministas a mensajes de entrada y salida en OpenClaw.

## Alcance

Se aceptan aportes que mejoren las políticas, la seguridad, la compatibilidad con OpenClaw, las pruebas y la documentación de instalación u operación. Las reglas deben ser locales, deterministas, explicables y no registrar el contenido de los mensajes.

Los cambios que incorporen clasificación semántica con LLMs, dependencias externas o telemetría deben documentar su impacto en privacidad, latencia, costos y modo de fallo antes de ser integrados.

## Antes de empezar

1. Revisá el [README](README.md), la configuración de ejemplo y las pruebas existentes.
2. Para cambios no triviales, abrí una issue en GitHub con objetivo, alcance, criterios de aceptación y riesgos.
3. Esperá el triage de los mantenedores antes de comenzar una implementación que vaya a proponerse para integración.
4. Verificá que la propuesta no reduzca las garantías del gate previo al agente ni amplíe la superficie de acceso del plugin sin una justificación explícita.

## Entorno y verificaciones

Requisitos:

- Node.js 22 o posterior.
- OpenClaw `2026.7.1` o posterior para probar la integración real.

Para ejecutar las pruebas unitarias:

```bash
npm test
```

Antes de abrir una pull request, ejecutá:

```bash
git diff --check
npm test
```

No incluyas credenciales, tokens, archivos `.env`, logs con contenido de conversaciones ni rutas internas sensibles.

## Flujo de trabajo

El repositorio utiliza GitHub y publica desde `main`. La rama está protegida: no se aceptan pushes directos, force-pushes ni borrados.

1. Abrí una issue y esperá su triage antes de preparar una propuesta de cambio.
2. Creá un fork del repositorio y una rama desde `main` con el formato `feature/<issue>-<resumen>` o `fix/<issue>-<resumen>`.
3. Hacé commits pequeños usando Conventional Commits, con descripciones en español.
4. Actualizá las pruebas y la documentación cuando el cambio altere comportamiento, configuración o compatibilidad.
5. Publicá la rama en tu fork y abrí una Pull Request hacia `main`.
6. En la Pull Request describí el cambio, las verificaciones ejecutadas, riesgos y la issue relacionada.
7. La integración requiere una aprobación de un propietario de código y la resolución de todas las conversaciones.

Ejemplos de commits:

```text
feat(policy): agregar detección de credenciales almacenadas
fix(outbound): evitar suprimir mensajes sin coincidencias
docs: aclarar el modo de auditoría
```

## Criterios para las políticas

- Priorizá reglas acotadas y testeables frente a patrones demasiado amplios.
- Cada nueva categoría debe incluir pruebas positivas y negativas.
- Conservá el comportamiento de auditoría sin contenido del mensaje.
- Un bloqueo de entrada debe ocurrir antes de iniciar el agente o consultar el LLM.
- Un bloqueo de salida debe probarse primero en modo `audit`.
- Documentá falsos positivos previsibles, límites y cualquier cambio de compatibilidad.

## Versiones y releases

El proyecto usa Semantic Versioning. Las versiones se declaran en `package.json`, se etiquetan como `vX.Y.Z` y se publican mediante GitHub Releases desde `main`.

Las notas de cada release deben indicar los cambios funcionales, las verificaciones realizadas y los riesgos o límites relevantes.

## Mantenedores y revisiones

Los propietarios de código definidos en [CODEOWNERS](.github/CODEOWNERS) revisan los cambios antes de integrarlos. Las issues están abiertas a la comunidad; abrir una issue o un Pull Request no concede permisos de escritura en el repositorio.

## Seguridad y divulgación responsable

No informes vulnerabilidades ni bypasses sensibles en issues públicas. Reportalos de forma privada al responsable del repositorio mediante los canales de GitHub habilitados para el proyecto.
