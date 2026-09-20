# Reglas canónicas del blog

Este directorio es la fuente de verdad para las reglas de agentes de juanfranciscofernandezherreros.github.io.

El objetivo es evitar que AGENTS.md, CLAUDE.md y otros documentos repitan las mismas reglas. Cada norma debe tener **un único hogar canónico** y el resto de archivos debe enlazarla.

## Precedencia

Cuando dos instrucciones se solapen, aplica este orden:

1. AGENTS.md y CLAUDE.md son puntos de entrada equivalentes y solo indican dónde están las reglas.
2. Este README.md define la precedencia y el mapa de lectura.
3. El documento temático correspondiente de este directorio define la regla canónica.
4. La documentación explicativa del repositorio puede describir el comportamiento, pero no redefinir reglas obligatorias.

Si dos documentos se contradicen, conserva la regla del nivel superior y corrige la duplicación o contradicción en el mismo cambio cuando sea posible.

## Mapa de reglas

- [editorial.md](editorial.md): norte editorial, interés, voz, densidad, rigor técnico y estructura narrativa.
- [content.md](content.md): series, bilingüismo, front matter, SEO, enlaces internos, índice y descubrimiento.
- [presentation.md](presentation.md): diseño visual, accesibilidad, HTML/CSS, imágenes, diagramas y descargas.
- [repository.md](repository.md): convenciones Jekyll del repositorio, layouts, comandos y archivos compartidos.
- [workflow.md](workflow.md): proceso obligatorio antes/después de editar y checklist de finalización.

## Qué leer según la tarea

Antes de modificar cualquier contenido o código del blog:

1. Lee este archivo.
2. Lee workflow.md.
3. Lee los documentos temáticos afectados por el cambio.
4. Inspecciona uno o dos ejemplos recientes del mismo tipo y los layouts/estilos implicados.

Además:

- artículo nuevo o edición editorial → editorial.md + content.md;
- cambios de HTML/CSS/layout/accesibilidad → presentation.md + repository.md;
- imágenes, diagramas o descargas → presentation.md;
- cambios en commands.html o buscador de comandos → repository.md;
- cambios de publicación, validación o descubrimiento → workflow.md + content.md.

## Regla de no duplicación

Una regla obligatoria debe definirse una sola vez. Si otra página necesita mencionarla, enlaza al documento canónico y resume solo el contexto necesario. No copies listas, checklists, valores o secuencias completas.

Cuando cambies una regla canónica, busca wording duplicado o contradictorio en el repositorio y corrígelo en el mismo cambio.

## Sincronización de AGENTS.md y CLAUDE.md

AGENTS.md y CLAUDE.md deben ser idénticos byte por byte. Ambos son launchers mínimos hacia este directorio; las reglas reales viven aquí.

Si uno cambia, el otro debe recibir exactamente el mismo contenido en el mismo commit.

## Comprobación de sincronización

Antes de dar por terminado un cambio que toque `AGENTS.md` o `CLAUDE.md`, verifica que ambos archivos siguen siendo idénticos:

```bash
cmp -s AGENTS.md CLAUDE.md
```

Si necesitas ver cualquier diferencia:

```bash
diff -u AGENTS.md CLAUDE.md
```

La validación correcta es que `cmp` termine sin diferencias y que `diff` no produzca salida.
