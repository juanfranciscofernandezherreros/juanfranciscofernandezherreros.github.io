---
layout: "article"
title: "csv-results-parser · CHANGELOG.md"
description: "CHANGELOG.md de csv-results-parser."
permalink: "/java-spring/csv-results-parser/es/"
lang: "es"
lang_url: ""
series: "Basketball CSV Microservices"
categories: ["Java & Spring"]
subcategories: ["Event Streaming"]
tags: ["changelog","csv","microservices"]
date: "2026-09-24"
reading_minutes: 3
published: true
---

# Changelog

## 2.0.2 - 2026-09-24

- Añade el schema Avro de salida `MatchResultKey` con `matchId`.
- Cambia la key del productor de `String` a `MatchResultKey`.
- Configura `KafkaAvroSerializer` tanto para key como para value.
- Actualiza tests para validar que la key Avro publicada contiene el `matchId`.
- Actualiza README y diagramas con el contrato Kafka Avro de salida.
- Mantiene el servicio sin persistencia y sin dependencias de base de datos.

## 2.0.1 - 2026-09-24

- Renombra el microservicio de `parser` a `csv-results-parser`.
- Renombra el artefacto Maven, el nombre Spring Boot y la clase principal.
- Actualiza el consumer group por defecto a `csv-results-parser`.
- Actualiza README, diagramas y tests de contrato.
- Mantiene sin cambios la arquitectura Kafka → Kafka y la ausencia de persistencia.

## 2.0.0 - 2026-09-24

- Cambia la arquitectura de Kafka → PostgreSQL a Kafka → parser → Kafka.
- Publica un `MatchResult` Avro por fila en el topic de salida.
- Elimina PostgreSQL, JPA, Flyway, migraciones, entidades, repositorios y Testcontainers.

## Versiones anteriores

- Historial anterior disponible en Git.
