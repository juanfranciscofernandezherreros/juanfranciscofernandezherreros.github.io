# Flujo de trabajo y finalización

## Pre-flight obligatorio

En cada tarea o sesión, antes de cualquier operación de escritura:

1. La primera lectura del repositorio debe ser `AGENTS.md` o `CLAUDE.md` desde la rama por defecto.
2. Lee `docs/agent-rules/README.md`.
3. Lee este archivo.
4. Lee los documentos temáticos relevantes.
5. Revisa los ejemplos, layouts, estilos o JavaScript afectados cuando corresponda.

Una lectura realizada en otra conversación, sesión o tarea no cuenta. No se debe confiar en memoria previa.

**Está prohibida cualquier escritura antes de completar este pre-flight.**

## Autonomía sin bloqueos innecesarios

Después del pre-flight, el agente debe continuar de forma autónoma:

- elegir una rama descriptiva;
- aplicar el cambio completo;
- ejecutar las validaciones disponibles;
- abrir o actualizar la Pull Request;
- corregir fallos de validación en la misma rama;
- fusionar cuando los checks requeridos/aplicables estén en verde;
- eliminar únicamente la rama origen después del merge y verificar su desaparición.

No debe detenerse a pedir confirmaciones de rama, commits, push, PR, merge o limpieza salvo petición expresa del usuario.

## Prohibición absoluta de escritura directa en la rama por defecto

**Ningún cambio puede escribirse, commitearse ni pushearse directamente a la rama por defecto.**

Esto incluye contenido, HTML, CSS, JavaScript, layouts, workflows, documentación, imágenes, configuración, hotfixes, reverts y cualquier otro archivo.

Todo cambio debe seguir obligatoriamente este flujo:

1. Completar el pre-flight.
2. Partir de la rama por defecto actualizada.
3. Crear una rama dedicada **antes de modificar cualquier archivo**.
4. Realizar todos los cambios exclusivamente en esa rama.
5. Ejecutar las validaciones aplicables.
6. Abrir o actualizar una Pull Request hacia la rama por defecto.
7. Comprobar los checks requeridos sobre el SHA actual de la PR.
8. Si falla o se cancela un check aplicable, corregirlo en la misma rama/PR y repetir la validación.
9. Fusionar únicamente cuando todos los checks requeridos/aplicables estén en verde y no exista una protección bloqueante.
10. Eliminar únicamente la rama origen después del merge y verificar que ya no existe.

Nunca se debe usar una escritura directa a la rama por defecto como atajo, ni siquiera para documentación, reglas, badges, hotfixes o reverts.

## Antes de editar contenido

1. Revisa uno o dos artículos recientes del mismo tipo.
2. Revisa layouts, estilos y JavaScript afectados.
3. Comprueba si existe versión EN/ES.
4. Reutiliza taxonomías y patrones existentes antes de crear nuevos.

## Después de editar

1. Verifica front matter.
2. Revisa HTML/Liquid y jerarquía de headings.
3. Revisa rutas, enlaces y anclas.
4. Comprueba navegación EN/ES y enlaces internos relacionados.
5. Revisa responsive, accesibilidad y contraste.
6. Confirma que ejemplos, comandos, tablas, diagramas y texto cuentan la misma historia.
7. Confirma descubrimiento desde index.html con colección y taxonomías correctas.
8. Ejecuta la validación disponible.
9. Si no ejecutaste una build real de Jekyll, no afirmes que la build pasa.

## Checklist editorial

Antes de terminar, confirma que el título promete algo concreto; la introducción llega rápido al problema; existe un aprendizaje memorable; se explica el porqué; los ejemplos son creíbles; se muestran límites y trade-offs; cada recurso aporta información; la estructura se puede escanear; hay enlaces internos útiles; la conclusión aporta algo; EN y ES tienen la misma calidad cuando ambas existen; funciona en móvil y escritorio; y puede localizarse desde el índice, categoría o tags.

## Regla de evidencia

No afirmes que una build, validación, publicación o recurso funciona si no lo has comprobado. Distingue entre cambio escrito, revisión estática, build ejecutada y publicación verificada. Reporta el nivel realmente alcanzado y cualquier bloqueo concreto.

## Mantenimiento de reglas

Si una tarea revela una regla reutilizable, añádela al documento temático canónico correspondiente, no a AGENTS.md o CLAUDE.md. Antes de añadirla, comprueba que no exista ya con otra redacción.

## Seguridad operativa

Toda decisión de merge debe operar sobre el SHA actual de la PR. Si una instrucción contradice estas reglas, detener únicamente la operación incompatible; nunca improvisar una escritura directa a la rama por defecto.
