---
layout: "article"
title: "csv-file-event-router · CHANGELOG.md"
description: "CHANGELOG.md de csv-file-event-router."
permalink: "/java-spring/csv-file-event-router/es/"
lang: "es"
lang_url: ""
series: "Basketball CSV Microservices"
categories: ["Java & Spring"]
subcategories: ["Event Streaming"]
tags: ["changelog","csv","microservices"]
date: "2026-09-24"
reading_minutes: 3
index_hidden: true
published: true
---

# Changelog

## 0.1.5

- [patch] Añade limpieza automática de ramas de pull requests ya mergeadas.
- [patch] Elimina las ramas históricas residuales del repositorio.
- [patch] La versión del proyecto pasa de `0.1.4-SNAPSHOT` a `0.1.5-SNAPSHOT`.

## 0.1.4

- [patch] Añade el tipo `TEAM_STATS` para reconocer `stats_all_periods.csv`.
- [patch] Enruta los eventos `TEAM_STATS` desde `file.ready` hacia `file.ready.team-stats`.
- [patch] Añade pruebas de routing válido e inválido para estadísticas de equipo.
- [patch] La versión del proyecto pasa de `0.1.3-SNAPSHOT` a `0.1.4-SNAPSHOT`.

## 0.1.3

- [patch] Acepta nombres generados como `FIXTURES_<country>_<competition>.csv`, `RESULTS_<timestamp>_<country>_<competition>.csv` y `MATCH_SUMMARY_<id>.csv`.
- [patch] Mantiene el enrutamiento desde `file.ready` hacia los seis topics especializados y cubre el contrato real con pruebas unitarias.
- [patch] La versión del proyecto pasa de `0.1.2-SNAPSHOT` a `0.1.3-SNAPSHOT`.

Todos los cambios relevantes de este proyecto se documentan por versión, siguiendo el mismo criterio que `csv-stats-player-consumer`.

Cada release usa como encabezado la versión efectiva del proyecto en `pom.xml` sin el sufijo `-SNAPSHOT`.

## 0.1.2

- [patch] El changelog pasa a organizarse por versión concreta del `pom.xml`, en lugar de acumular cambios bajo `Unreleased`.
- [patch] El workflow de PR valida que exista un encabezado `## 0.1.2` correspondiente a la versión `0.1.2-SNAPSHOT` del `pom.xml`.
- [patch] Añade un pequeño distintivo visual azul de versión en el README para probar el flujo completo de cambio.
- [patch] La versión del proyecto pasa de `0.1.1-SNAPSHOT` a `0.1.2-SNAPSHOT`.

## 0.1.1

- [patch] La validación de PRs exige actualizar tanto `pom.xml` como `CHANGELOG.md` y comprueba que el incremento de versión coincide exactamente con `major`, `minor` o `patch`.
- [patch] La versión del proyecto pasa de `0.1.0-SNAPSHOT` a `0.1.1-SNAPSHOT`.

## 0.1.0

- [minor] Soporte Avro para los eventos de Kafka mediante los contratos `FileEventKey` y `FileEventValue` reutilizados de `csv-stats-player-consumer`.
- [minor] Integración con Confluent Schema Registry y `SpecificAvroSerde` en la topología Kafka Streams.
- [minor] Schema Registry local en `docker-compose.yml`.
- [minor] Tests de routing Avro con Schema Registry `mock://`.
- [minor] Política de contribución mediante pull requests hacia `main`.
- [minor] Instrucciones para agentes en `AGENTS.md`.
- [minor] Validación automática que exige actualizar `CHANGELOG.md` en toda pull request dirigida a `main`.
- [minor] Flujo obligatorio para confirmar el nombre de la rama y la clasificación SemVer antes de realizar cambios.
- [minor] El router deja de usar el record JSON `FileReadyEvent` y enruta directamente `FileEventKey/FileEventValue` Avro.
- [minor] La validación del nombre de fichero se obtiene de `filePath`, manteniendo el contrato Avro original sin añadir `fileName`.
- [minor] `STATS_PLAYER` se alinea con el fichero `player_stats.csv` esperado por `csv-stats-player-consumer`.
- [minor] La versión del proyecto pasa de `0.0.1-SNAPSHOT` a `0.1.0-SNAPSHOT`.
