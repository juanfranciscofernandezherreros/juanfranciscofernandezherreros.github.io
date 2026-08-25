# Ejecución de "Part 0 — Before you begin" (2026-08-25)

Evidencia de haber seguido la guía en
[part-0/before-you-begin](https://juanfranciscofernandezherreros.github.io/argo-real-world-microservices/part-0/before-you-begin/es/)
en un equipo Windows 11 real.

## Resultado por comando

| # | Comando | Resultado | Log |
|---|---|---|---|
| 1 | `winget install Git.Git` | ✅ Instalado v2.55.0.3 | [01-git-install.log](01-git-install.log) |
| 2 | `winget install Docker.DockerDesktop` | ✅ Ya estaba instalado, sin actualización disponible | [02-docker-install.log](02-docker-install.log) |
| 3 | `winget install Kubernetes.kind` | ✅ Instalado v0.32.0 | [03-kind-install.log](03-kind-install.log) |
| 4 | `winget install EclipseAdoptium.Temurin.21.JDK` | ✅ Instalado v21.0.12.101 | [04-jdk-install.log](04-jdk-install.log) |
| 5 | `winget install Apache.Maven` | ❌ Paquete no encontrado en las fuentes de winget de este equipo (ni tras `winget source update`) | [05-maven-install.log](05-maven-install.log) |
| 5b | Instalación manual de Maven 3.9.16 desde maven.apache.org | ✅ `mvn -v` funcionando correctamente | ver log anterior |
| 6 | `winget install argoproj.argocd` | ✅ Instalado v3.5.1 | [06-argocd-install.log](06-argocd-install.log) |

## Nota sobre las capturas de pantalla

Las imágenes `.png` de esta carpeta son capturas reales de pantalla tomadas justo
después de cada comando, pero **no muestran la consola con la salida del comando**:
se tomaron mediante un proceso automatizado que no abre una ventana de terminal
visible en el escritorio, por lo que solo capturan lo que estaba visible en pantalla
(en este caso, VS Code) en ese instante. La evidencia real del resultado de cada
comando está en los archivos `.log` de texto, que contienen la salida completa de
`winget install`.

## Incidencia detectada

El paso 5 del artículo (`winget install Apache.Maven`) no funciona en un Windows 11
con las fuentes de winget actualizadas a fecha 2026-08-25: el paquete no aparece ni
en `winget search Maven` ni en `winget search "Apache Maven"`. Se resolvió instalando
Maven manualmente desde el ZIP oficial (https://maven.apache.org/download.cgi) en
`%LOCALAPPDATA%\Programs\Maven` y añadiendo `MAVEN_HOME`/`PATH` a nivel de usuario.
Puede que el artículo necesite actualizarse para reflejar esto.
