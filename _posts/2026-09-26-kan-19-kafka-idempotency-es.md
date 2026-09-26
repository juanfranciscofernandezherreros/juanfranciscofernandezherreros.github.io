---
layout: "article"
title: "KAN-19: idempotencia real en Kafka con PostgreSQL, claves naturales y upserts atómicos"
description: "Por qué KAN-19 es prioridad máxima en Basketball Stats y cómo convertir redeliveries, reintentos y reimportaciones Kafka en operaciones deterministas sobre PostgreSQL."
permalink: "/java-spring/kan-19-kafka-idempotency/es/"
lang: "es"
lang_url: ""
series: "Basketball CSV Microservices"
categories: ["Java & Spring"]
subcategories: ["Event Streaming"]
tags: ["kafka","postgresql","idempotency","upsert","on-conflict","spring-kafka","microservices","event-driven","jira","basketball-stats"]
date: "2026-09-26"
reading_minutes: 11
published: true
---

# KAN-19: idempotencia real en Kafka con PostgreSQL, claves naturales y upserts atómicos

Después de cerrar la estrategia común de errores de [KAN-18]({{ '/java-spring/kan-18-kafka-error-strategy/es/' | relative_url }}), el siguiente problema del pipeline Basketball Stats no está en Kafka: está en lo que ocurre **cuando Kafka hace exactamente lo que debe hacer y entrega un mensaje más de una vez**.

[KAN-19](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-19) tiene prioridad **Highest** porque ataca una propiedad básica del sistema: que un redelivery, un retry, una reimportación o dos consumidores concurrentes no puedan dejar PostgreSQL con duplicados, carreras o estados ambiguos.

En un sistema event-driven, asumir que cada mensaje llega exactamente una vez es una forma muy rápida de esconder un bug de integridad detrás de una demo que parece funcionar.

La pregunta correcta no es:

> ¿Cómo evito que Kafka repita un mensaje?

La pregunta correcta es:

> ¿Qué debe ocurrir si el mismo hecho llega dos veces, o dos veces a la vez?

KAN-19 existe para responder esa pregunta de forma consistente en todos los microservicios de persistencia.

## Por qué este trabajo es de prioridad máxima

Kafka ofrece garantías fuertes, pero la aplicación sigue teniendo que decidir qué significa procesar un evento repetido.

Un consumer puede recibir de nuevo un mensaje por motivos perfectamente normales:

- un proceso cae después de escribir en PostgreSQL pero antes de confirmar el offset;
- un retry vuelve a ejecutar la operación;
- un rebalance mueve una partición a otra instancia;
- una importación se lanza dos veces;
- el mismo fichero se vuelve a publicar;
- dos mensajes con la misma clave de negocio llegan casi simultáneamente;
- una corrección de datos reutiliza la misma entidad lógica con nuevos valores.

Si el servicio implementa la escritura como:

```text
buscar si existe
        ↓
si no existe
        ↓
guardar
```

parece razonable, pero existe una ventana de carrera.

Dos consumidores pueden ejecutar al mismo tiempo:

```text
Consumer A: SELECT → no existe
Consumer B: SELECT → no existe
Consumer A: INSERT
Consumer B: INSERT
```

A partir de ahí el resultado depende de constraints, orden de ejecución y manejo de excepciones. La aplicación ya no tiene una política: tiene un accidente.

Por eso KAN-19 no es una mejora cosmética. Es trabajo de **consistencia de datos**.

## El objetivo: comportamiento determinista

La propiedad que buscamos puede expresarse de forma sencilla:

```text
procesar(evento)
=
procesar(evento, evento, evento)
```

si esos tres mensajes representan el mismo hecho.

Eso no significa que todos los flujos deban ignorar cualquier repetición. Una reimportación puede ser una corrección legítima y, en ese caso, el comportamiento adecuado quizá sea actualizar.

La clave es que cada agregado tenga una regla explícita.

KAN-19 exige definir, por flujo:

- cuál es la clave de idempotencia;
- qué papel tiene `sourceEventId`;
- cuál es la clave natural del dato;
- si una repetición se ignora, actualiza o versiona;
- qué constraint de PostgreSQL respalda esa decisión;
- cómo se comporta el sistema bajo concurrencia;
- cómo se prueba.

## `sourceEventId` no sustituye a la clave de negocio

Una tentación habitual es considerar `sourceEventId` como solución universal.

Es útil, pero responde a una pregunta diferente.

`sourceEventId` identifica **qué importación o evento originó una operación**. Una clave natural identifica **qué entidad de negocio estamos modificando**.

Por ejemplo, en estadísticas de jugador la identidad lógica puede ser:

```text
(match_id, player, team)
```

mientras que `sourceEventId` explica qué importación produjo esa versión.

Ambas piezas son valiosas:

```text
clave natural
    → protege identidad y duplicados

sourceEventId
    → aporta trazabilidad y contexto de reimportación
```

Usar solo `sourceEventId` puede impedir duplicados técnicos pero no resuelve qué hacer cuando dos eventos distintos corrigen el mismo dato lógico.

## PostgreSQL debe ser la última línea de defensa

La estrategia común de KAN-19 debe mover la garantía crítica lo más cerca posible del almacenamiento.

No conviene confiar únicamente en Java para mantener una invariante que PostgreSQL puede expresar de forma atómica.

El patrón objetivo es:

```sql
INSERT INTO ...
VALUES (...)
ON CONFLICT (<business-key>)
DO UPDATE SET ...;
```

o, cuando la política sea first-write-wins explícita:

```sql
INSERT INTO ...
VALUES (...)
ON CONFLICT (<business-key>)
DO NOTHING;
```

La diferencia es importante.

`ON CONFLICT` no es solo una optimización que elimina un `SELECT`. También reduce el problema de concurrencia a una única operación que PostgreSQL puede resolver utilizando una constraint `UNIQUE` o una primary key.

La base de datos deja de ser un almacenamiento pasivo y se convierte en parte activa de la garantía de idempotencia.

## RESULTS: reimportar un partido debe tener una regla

[ KAN-35 ](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-35) plantea el problema en `csv-results-persistence`: qué hacer cuando vuelve a llegar el mismo `match_id`.

Hay tres políticas posibles:

1. ignorar cualquier repetición;
2. actualizar el estado actual;
3. guardar versiones históricas.

La decisión debe ser explícita.

Para un modelo de estado actual, la opción natural es que `match_id` sea la clave de negocio y una reimportación válida pueda corregir el registro:

```text
primera importación       → INSERT
mismo dato otra vez       → mismo estado final
misma clave corregida     → UPDATE
```

`sourceEventId` permite conservar qué importación generó el último estado.

Lo peligroso es dejar esa semántica implícita en el comportamiento de `save()`.

## FIXTURES: idempotencia respaldada por una constraint real

[KAN-121](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-121) es la adopción directa de KAN-19 en `csv-fixtures-persistence`.

Aquí el objetivo es que la clave natural de un fixture quede documentada y protegida por PostgreSQL.

El resultado esperado no es solo que "normalmente no haya duplicados".

Debe existir una invariante comprobable:

```text
dos mensajes equivalentes
        ↓
una única entidad lógica
```

y esa propiedad debe mantenerse incluso cuando las operaciones llegan de forma concurrente.

## MATCH: eliminar el first-write-wins accidental

El flujo MATCH tiene dos tickets muy concretos.

[KAN-46](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-46) exige decidir si una reimportación de `match_id` actualiza, ignora o versiona.

[KAN-47](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-47) exige eliminar la carrera:

```text
existsByMatchId()
        ↓
save()
```

La solución técnica viene después de la decisión de negocio.

Si una corrección debe sustituir el resumen anterior, la política se convierte en un upsert atómico sobre una constraint única de `match_id`.

Si el comportamiento deseado fuera first-write-wins, también debe expresarse de forma atómica con `DO NOTHING`.

Lo importante es que "la primera escritura gana" deje de ser una consecuencia accidental del código.

## PLAYER: una clave natural que ya está definida

En [KAN-53](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-53), la clave de negocio ya está identificada:

```text
(match_id, name, team)
```

El trabajo consiste en sustituir:

```text
findByMatchIdAndNameAndTeam()
        +
save()
```

por una única escritura atómica.

Ese cambio resuelve dos problemas a la vez:

- redelivery del mismo jugador;
- concurrencia entre mensajes que representan la misma entidad.

También vuelve explícita una idea importante: la idempotencia debe alinearse con la identidad del dominio, no con la estructura de una entidad JPA.

## TEAM-STATS: la base de datos ya conoce la regla

[KAN-66](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-66) describe una clave de negocio precisa:

```text
(match_id, period, category, metric)
```

Eso permite expresar directamente la operación:

```sql
ON CONFLICT (match_id, period, category, metric)
DO UPDATE
```

Este caso muestra bien por qué KAN-19 debe completarse antes de [KAN-22](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-22), dedicado a rendimiento y batch.

Optimizar una escritura cuya semántica todavía es ambigua solo consigue ejecutar más rápido una posible inconsistencia.

Primero definimos qué significa escribir correctamente. Después optimizamos el throughput.

## POINT-BY-POINT: el caso difícil no es una fila, es un proceso

`csv-point-by-point-persistence` es el flujo más interesante porque su idempotencia no puede reducirse únicamente a una fila con una constraint.

El protocolo se parece a esto:

```text
START
  │
  ├── ROW
  ├── ROW
  ├── ROW
  │
  └── COMPLETED
```

[KAN-59](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-59) obliga a definir qué ocurre si el proceso cae a mitad de importación y Kafka vuelve a entregar mensajes.

Las reglas necesarias son más parecidas a una máquina de estados:

```text
START repetido
→ no crea una importación incoherente

ROW repetida
→ no duplica datos

COMPLETED repetido
→ no cambia un resultado ya válido

import abandonado
→ existe una política de recuperación
```

Además, [KAN-60](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-60) corrige un detalle crítico: la validación final de filas no puede contar datos históricos de otra importación del mismo partido.

El conteo debe quedar asociado al import actual, mediante `sourceEventId`, un `importId` o una estrategia equivalente.

Aquí se ve con claridad que idempotencia no significa únicamente "poner un UNIQUE".

A veces significa modelar correctamente el ciclo de vida del procesamiento.

## La estrategia común

KAN-19 debería dejar una tabla conceptual como esta documentada para cada persistence:

| Flujo | Clave de negocio | Papel de `sourceEventId` | Política de conflicto |
| --- | --- | --- | --- |
| RESULTS | `match_id` | trazabilidad de reimportación | upsert de estado actual |
| FIXTURES | clave natural del fixture | trazabilidad | upsert o regla explícita |
| MATCH | `match_id` | trazabilidad | política explícita + operación atómica |
| PLAYER | `match_id + name + team` | trazabilidad | upsert |
| POINT-BY-POINT | import + identidad de fila | identidad de ejecución | máquina de estados idempotente |
| TEAM-STATS | `match_id + period + category + metric` | trazabilidad | upsert |

El detalle final puede variar durante la implementación, pero ninguna fila debe quedar con una semántica accidental.

## Qué hay que probar

Un test de idempotencia que solo llama dos veces al mismo método de servicio no es suficiente.

Los tests deben atacar los escenarios que pueden romper la garantía.

### Redelivery

```text
evento
evento
```

Resultado esperado: una única entidad lógica y un estado determinista.

### Reimportación

```text
evento v1
evento v2 para la misma clave natural
```

Resultado esperado: comportamiento conforme a la política documentada, no al orden casual de ejecución.

### Concurrencia

```text
Thread A ─┐
          ├── misma business key
Thread B ─┘
```

Resultado esperado: PostgreSQL mantiene la invariante sin una carrera funcional.

### Recuperación parcial

Especialmente para POINT-BY-POINT:

```text
START
ROW
ROW
<fallo>
ROW redelivered
COMPLETED
```

Resultado esperado: el import termina correctamente sin filas duplicadas ni conteos contaminados por ejecuciones anteriores.

Estos escenarios justifican tests de integración contra PostgreSQL real, por ejemplo con Testcontainers, porque la garantía depende precisamente de constraints, transacciones y comportamiento concurrente del motor.

## Por qué KAN-19 bloquea rendimiento

En Jira, KAN-19 bloquea [KAN-22](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-22), y el orden tiene sentido.

Batching, escrituras asíncronas y reducción de flushes aumentan el throughput, pero también amplifican cualquier error conceptual en la estrategia de persistencia.

Antes de agrupar cientos de operaciones por lote hay que saber:

- qué registro identifica cada entidad;
- qué ocurre ante conflicto;
- qué puede repetirse;
- qué puede actualizarse;
- qué constraint garantiza la invariante;
- qué significa una importación completa.

La secuencia correcta es:

```text
fiabilidad Kafka
      ↓
idempotencia
      ↓
batch / rendimiento
```

KAN-18 resolvió cómo recuperarse de errores.

KAN-19 debe resolver cómo repetir trabajo sin corromper el resultado.

KAN-22 podrá entonces optimizar un comportamiento ya definido.

## Orden de implementación

El plan más seguro es empezar por persistencias con una identidad sencilla y terminar con el flujo que modela un proceso completo.

```text
1. csv-results-persistence
2. csv-fixtures-persistence
3. csv-stats-match-persistence
4. csv-stats-player-persistence
5. csv-team-stats-persistence
6. csv-point-by-point-persistence
```

Los primeros servicios permiten consolidar un patrón común de:

```text
business key
    +
UNIQUE constraint
    +
INSERT ... ON CONFLICT
    +
test de redelivery
    +
test de concurrencia
```

Después, POINT-BY-POINT puede reutilizar esas ideas dentro de una estrategia más rica de estado de importación.

## Cuándo estará realmente terminada KAN-19

KAN-19 no estará cerrada porque cada servicio tenga "algún control de duplicados".

Debe poder demostrarse que:

- procesar dos veces el mismo hecho no crea duplicados;
- una reimportación tiene una política documentada;
- la base de datos respalda las claves de negocio;
- no quedan patrones `read-then-write` expuestos a carreras donde PostgreSQL pueda resolverlos atómicamente;
- existen tests de redelivery;
- existen pruebas de concurrencia donde sean relevantes;
- POINT-BY-POINT puede recuperarse de imports parciales;
- `sourceEventId` se utiliza con un propósito claro y no como sustituto arbitrario de la identidad del dominio.

## La lección que quiero conservar

La idempotencia no es una opción de configuración de Kafka.

Es una propiedad conjunta de:

```text
evento
  +
modelo de dominio
  +
operación de escritura
  +
constraint de base de datos
  +
política de reimportación
```

Kafka puede volver a entregar un mensaje. PostgreSQL puede recibir dos escrituras concurrentes. Un usuario puede importar dos veces el mismo fichero.

Un sistema robusto no intenta hacer desaparecer esas situaciones.

Las convierte en casos normales con un resultado definido.

Eso es lo que hace que KAN-19 tenga prioridad máxima: antes de pedirle al pipeline que procese más rápido, hay que garantizar que **procesar otra vez sigue siendo correcto**.
