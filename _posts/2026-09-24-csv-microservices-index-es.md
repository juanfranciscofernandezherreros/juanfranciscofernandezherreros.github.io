---
layout: "article"
title: "Índice de microservicios CSV"
description: "Índice de las páginas csv-* con la versión declarada en pom.xml y README.md de main."
permalink: "/java-spring/csv-microservices/es/"
lang: "es"
lang_url: ""
series: "Basketball CSV Microservices"
categories: ["Java & Spring"]
subcategories: ["Event Streaming"]
tags: ["csv","microservices","changelog","maven"]
date: "2026-09-24"
reading_minutes: 3
published: true
---

# Índice de microservicios CSV

| Microservicio | Página | Versión `pom.xml` en `main` | Versión `README.md` en `main` |
|---|---|---:|---:|
| `csv-file-event-router` | [CHANGELOG]({{ '/java-spring/csv-file-event-router/es/' | relative_url }}) | `0.1.5-SNAPSHOT` | `0.1.5` |
| `csv-results-parser` | [CHANGELOG]({{ '/java-spring/csv-results-parser/es/' | relative_url }}) | `2.0.2` | `2.0.2` |
| `csv-results-persistence` | [CHANGELOG]({{ '/java-spring/csv-results-persistence/es/' | relative_url }}) | `1.0.1` | `1.0.1` |
| `csv-fixtures-parser` | [CHANGELOG]({{ '/java-spring/csv-fixtures-parser/es/' | relative_url }}) | `1.0.0` | `1.0.0` |
| `csv-fixtures-persistence` | [CHANGELOG]({{ '/java-spring/csv-fixtures-persistence/es/' | relative_url }}) | `1.0.0` | `1.0.0` |
| `csv-stats-match-parser` | [CHANGELOG]({{ '/java-spring/csv-stats-match-parser/es/' | relative_url }}) | `1.0.1` | `1.0.1` |
| `csv-stats-match-persistence` | [CHANGELOG]({{ '/java-spring/csv-stats-match-persistence/es/' | relative_url }}) | `1.0.1` | `1.0.1` |
| `csv-stats-player-parser` | [CHANGELOG]({{ '/java-spring/csv-stats-player-parser/es/' | relative_url }}) | `1.0.1` | `1.0.1` |
| `csv-stats-player-persistence` | [CHANGELOG]({{ '/java-spring/csv-stats-player-persistence/es/' | relative_url }}) | `1.0.2` | `1.0.2` |
| `csv-point-by-point-parser` | [CHANGELOG]({{ '/java-spring/csv-point-by-point-parser/es/' | relative_url }}) | `1.0.2` | `1.0.2` |
| `csv-point-by-point-persistence` | [CHANGELOG]({{ '/java-spring/csv-point-by-point-persistence/es/' | relative_url }}) | `1.0.1` | `1.0.1` |
| `csv-team-stats-parser` | [CHANGELOG]({{ '/java-spring/csv-team-stats-parser/es/' | relative_url }}) | `1.0.0` | `1.0.0` |
| `csv-team-stats-persistence` | [CHANGELOG]({{ '/java-spring/csv-team-stats-persistence/es/' | relative_url }}) | `1.0.0` | `1.0.0` |

## Estado de versiones

En 12 de los 13 microservicios, la versión de `pom.xml` y la declarada en `README.md` coinciden exactamente.

En `csv-file-event-router`, `pom.xml` mantiene `0.1.5-SNAPSHOT` mientras el README muestra `0.1.5`. Esto refleja que Maven sigue marcando la revisión como snapshot, aunque la documentación muestra la versión base `0.1.5`.
