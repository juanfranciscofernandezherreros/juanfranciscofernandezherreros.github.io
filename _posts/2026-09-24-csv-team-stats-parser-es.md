---
layout: "article"
title: "csv-team-stats-parser · CHANGELOG.md"
description: "CHANGELOG.md de csv-team-stats-parser."
permalink: "/java-spring/csv-team-stats-parser/es/"
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

## 1.0.0 - 2026-09-24
- Añade el parser de `stats_all_periods.csv`.
- Consume `file.ready.team-stats`.
- Publica `TeamStatsKey / TeamStatsValue` en `team-stats.parsed`.
- Conserva estadísticas Overall y por cuarto sin forzar tipos numéricos.
