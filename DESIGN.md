---
name: Dacate
description: Asistente académico personal — sistema sobrio, tipográfico y de esquinas rectas para estudiantes.
colors:
  papel: "oklch(1 0 0)"
  negro-calido: "oklch(0.147 0.004 49.3)"
  tinta: "oklch(0.214 0.009 43.1)"
  crema: "oklch(0.986 0.002 67.8)"
  papel-bulo: "oklch(0.96 0.002 17.2)"
  gris-anotacion: "oklch(0.547 0.021 43.1)"
  filete: "oklch(0.922 0.005 34.3)"
  oxido: "oklch(0.577 0.245 27.325)"
  anillo: "oklch(0.714 0.014 41.2)"
typography:
  display:
    fontFamily: "Playfair Display Variable, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Playfair Display Variable, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.025em"
  body:
    fontFamily: "Noto Sans Variable, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Noto Sans Variable, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.1em"
  micro:
    fontFamily: "Noto Sans Variable, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
components:
  button-primary:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.crema}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "40px"
    padding: "0 24px"
  button-primary-hover:
    backgroundColor: "color-mix(in oklch, {colors.tinta} 80%, transparent)"
    textColor: "{colors.crema}"
    rounded: "{rounded.none}"
    height: "40px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.negro-calido}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "40px"
    padding: "0 24px"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.negro-calido}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: "40px"
    padding: "4px 0px"
  card:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.negro-calido}"
    rounded: "{rounded.none}"
    padding: "32px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.negro-calido}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: "36px"
    padding: "8px 12px"
  badge:
    textColor: "{colors.gris-anotacion}"
    typography: "{typography.micro}"
    rounded: "{rounded.none}"
---

# Design System: Dacate

## Overview

**Creative North Star: "El Cuaderno de Cuadrícula"**

Dacate se ve como un cuaderno de cuadrícula digital: una retícula de líneas finas, esquinas rectas y absolutas, y jerarquía puramente tipográfica. La información académica —tareas, exámenes, horarios— se ordena dentro de celdas de papel blanco definidas por filetes de un píxel, nunca por sombras ni por cajas grises flotantes. El resultado es sobrio y escaneable: un estudiante abre la pantalla y lee, sin que la interfaz compita por atención.

La voz del sistema es **precisa, sobria y estudiantil**. Todo lo accionable se declara en versalitas trackeadas (botones, badges, encabezados de sección); todo lo que se lee en párrafo va en Noto Sans a 14px; todo lo que nombra o encabeza va en Playfair Display, la serif que aporta el carácter académico. El único color con voz propia es el rojo de corrección, reservado para errores y vencimientos. La anti-reference explícita es el **SaaS alegre redondeado**: nada de esquinas tipo pastilla, degradados vibrantes ni tipografía geométrica de startup.

La profundidad es plana: las superficies se separan por hairlines (`filete`) y por capas de papel tonal (blanco → crema → off-white cálido), con sombra únicamente en overlays. El contraste alto pero cálido (tinta casi negra sobre papel) mantiene la calma de estudio y la legibilidad entre clases.

**Key Characteristics:**
- Esquinas a cero en todos los componentes (radio 0px); círculos solo como dots de 6px y avatares.
- Filetes de 1px como único medio de separación.
- Serif Playfair Display en mayúsculas trackeadas para títulos; Noto Sans para todo lo demás.
- Micro-etiquetas en versalitas 10–12px con tracking 0.1em.
- Paleta monocroma cálida (papel/tinta) + un rojo funcional.
- Sombra solo en overlays; las tarjetas descansan planas con un anillo de 5%.

## Colors

Paleta monocroma de papel y tinta con un único acento funcional: todo es blanco cálido, crema y gris piedra, cortado por una tinta casi negra y un rojo de corrección.

### Primary
- **Tinta de Imprenta** (`oklch(0.214 0.009 43.1)`): el primario de la casa. Botones sólidos, logomark (fondo del icono de graduación), enlaces activos, elementos seleccionados del calendario y el panel izquierdo de autenticación a sangre. Es un casi-negro cálido (matiz 43°), no un gris frío: contraste máximo sin romper la temperatura de la escuela.

### Neutral
- **Papel Blanco** (`oklch(1 0 0)`): fondo global de aplicación y de las tarjetas.
- **Negro Cálido** (`oklch(0.147 0.004 49.3)`): texto principal, foreground, títulos y contenido de tarjetas.
- **Crema de Prensa** (`oklch(0.986 0.002 67.8)`): foreground sobre tinta (texto de botones primarios) y fondo de la barra lateral — un blanco cálido que separa la navegación del papel del área de trabajo sin necesidad de borde grueso.
- **Papel de Bulo** (`oklch(0.96 0.002 17.2)`): superficie tonal de reposo: variantes secondary/muted, hover de botones ghost y outline, fondos de ítems de menú y cabeceras de tabla.
- **Gris Anotación** (`oklch(0.547 0.021 43.1)`): texto secundario — descripciones, metadatos de tareas, fechas, placeholders, etiquetas de grupo del menú lateral.
- **Filete** (`oklch(0.922 0.005 34.3)`): el color de línea. Bordes de listas, inputs, separadores, bordes de la app y de la barra lateral. Casi siempre aparece como 1px.

### Funcionales
- **Rojo de Corrección** (`oklch(0.577 0.245 27.325)`): errores de validación, tareas vencidas, prioridad alta, botón destructivo y cierre de sesión. Nunca decorativo.
- **Anillo de Foco** (`oklch(0.714 0.014 41.2)`): color de foco accesible (ring) en toda la app; cálido, no azul.

### Named Rules
**The Filete Rule.** Toda separación entre superficies es un filete de 1px en `filete` o un anillo al 5% del foreground. Nunca cajas grises flotantes, nunca degradados para "separar".
**The Red-Only Rule.** El Rojo de Corrección solo aparece donde hay estado crítico: error, vencimiento, prioridad alta, destrucción. Si un elemento rojo no comunica riesgo, está mal usado.

Dark mode swaps the token values under `.dark` (background to a warm near-black, card to tinta, borders to white at 10%); the light values above are the normative reference.

## Typography

**Display Font:** Playfair Display Variable (con Georgia, serif)
**Body Font:** Noto Sans Variable (con system-ui, sans-serif)
**Label/Mono Font:** sin mono propia; el código hereda ui-monospace

**Character:** El parejo académico: una serif editorial con contraste alto para nombrar y encabezar, y una sans humanista neutra para todo lo que se opera. La serif no baja nunca al cuerpo de texto; la sans no asciende nunca a los títulos de sección.

### Hierarchy
- **Display** (600, 24px / 1.5rem, line-height 1.25, tracking -0.01em): títulos de página en autenticación ("Bienvenido de vuelta"). Solo en Playfair, peso semibold.
- **Title** (600, 18px / 1.125rem, line-height 1.4, tracking 0.025em, UPPERCASE): títulos de tarjeta, de diálogo, de estado vacío y la palabra DACATE. Playfair en mayúsculas con tracking amplio es la firma tipográfica del producto.
- **Body** (400, 14px / 0.875rem, line-height 1.5): texto operativo por defecto — descripciones, listas, metadatos, párrafos de formulario. Los inputs usan 16px en móvil (evita el zoom de iOS) y 14px desde `md`.
- **Label** (600, 12px / 0.75rem, tracking 0.1em, UPPERCASE): botones, encabezados de sección (`SectionHeader`), etiquetas de grupo del sidebar, divisores de formulario, chips de autenticación.
- **Micro** (600, 10px / 0.625rem, tracking 0.1em, UPPERCASE): badges de estado de tarea y metadatos de tabla.

### Named Rules
**The Versalitas Rule.** Toda etiqueta corta — botón, badge, encabezado de sección, título de tarjeta, ítem de menú de grupo — va en mayúsculas con tracking entre 0.025em y 0.1em. El cuerpo de texto jamás va en mayúsculas; la serif solo en mayúsculas.
**The Serif Ceiling Rule.** Playfair Display vive en títulos, marca y estados vacíos. Nunca en párrafos, inputs, tablas ni navegación de lista.

## Layout

**Shell de aplicación:** barra lateral izquierda de 16rem colapsable a un canal de iconos (3rem) con tooltips; sobre ella, header sticky de 56px (h-14) con fondo `background/80` + backdrop-blur, separador vertical y título de sección en `muted-foreground`; el contenido principal lleva padding de 24px (p-6). La barra lateral lleva su propio filete (border-sidebar-border) arriba y abajo: logo arriba, menú en el centro, perfil/configuración/cerrar sesión al pie.

**Autenticación:** split 50/50 desde `lg` (1024px). Panel izquierdo de tinta a sangre con tres círculos decorativos de `primary-foreground` al 10% de opacidad, logomark, cita en Playfair y chips de features; formulario a la derecha centrado en un `max-w-sm` (384px) con padding horizontal de 24px/64px. Bajo `lg` el panel decorativo desaparece y aparece el logomark móvil centrado a la izquierda del formulario.

**Ritmo de espaciado:** base 4px (escala Tailwind). Tarjetas descansan a 32px de padding (20px en `size="sm"`), filas y listas a 16px, metadatos con gaps de 8px, secciones separadas por 16–24px. Densidad media-compacta: la información de una tarea vive en un renglón de 14px con metadatos a 12px.

**Responsive:** quiebre en 1024px (`lg`) para el split de autenticación y para reducir la escala tipográfica base de 18px a 16px; el sidebar colapsa a iconos y las grillas de tarjetas pasan de 2–3 columnas a 1 en `md`. Nada se apila con sombra: en móvil todo sigue separado por filetes.

## Elevation & Depth

El sistema es plano con anillos. Las superficies descansan sin sombra perceptible: la separación la dan filetes de 1px y el escalonamiento tonal papel → papel de bulo → crema. La sombra existe solo como respuesta de estado o en capas flotantes de verdad (diálogos, popovers). El header sticky usa blur en lugar de sombra para no crear una línea pesada.

### Shadow Vocabulary
- **Tacto de tarjeta** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)` + `ring-1 ring-foreground/5`): tarjetas shadcn (`Card`). El anillo hace el trabajo visible; la sombra es casi subliminal.
- **Overlay** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` + `ring-foreground/10`): diálogos y popovers, siempre acompañados de backdrop `black/20` con blur.
- **Aviso de hover** (solo en enlaces sociales heredados del template, `0 10px 15px -3px`): no usar en componentes nuevos.

### Named Rules
**The Flat-By-Default Rule.** En reposo, ninguna superficie lleva sombra. Si necesita separación, usa filete o tono; si necesita sombra, es porque está flotante (overlay) o en hover.

## Shapes

Forma severa: esquinas a cero por defecto en absolutamente todos los componentes — botones, inputs, tarjetas, diálogos, badges, checkboxes, celdas de calendario, ítems de menú (`rounded-none` aparece 88 veces frente a cualquier otra opción). El proyecto sí define una escala de radio (`--radius: 0.625rem` con derivados sm…4xl), pero la implementación la anula deliberadamente a 0: la escala existe como infraestructura shadcn, no como lenguaje visible.

Los círculos (`rounded-full`, 21 usos) están reservados a un vocabulario mínimo: dots de prioridad y de materia de 6px (size-1.5), avatares, y decoración de fondo. Bordes siempre de 1px; no hay bordes gruesos ni dobles. El calendario usa celdas cuadradas con `--cell-radius: 0` explícito. Los contenedores propios de módulos (TaskCard, WeeklyProgress) repiten el patrón `border border-border rounded-none p-4` — caja de filete, sin sombra.

### Named Rules
**The Zero-Corner Rule.** Radio 0px en todo componente nuevo. Un radio de 4px "por suavizar" rompe el sistema; si necesitas curva, el único elemento permitido es un dot o un avatar.

## Components

La línea de carácter: **severo y tipográfico** — bloques macizos de tinta con texto en versalitas, inputs como líneas escritas bajo el texto, tarjetas como celdas de papel.

### Buttons
- **Shape:** esquinas a 0px (`rounded-none`), altura 40px por defecto (36 sm / 44 lg / 28 xs), borde transparente.
- **Primary:** fondo `tinta`, texto `crema`, etiqueta en Label (12px, 600, uppercase, tracking 0.1em), padding horizontal 24px. Icono de 14px alineado con gap 6px.
- **Hover / Focus:** hover atenúa a `tinta` al 80% (`bg-primary/80`); `:active` se hunde 1px; focus-visible dibuja `border-ring` + `ring-2 ring-ring/30`. Transición `all` a 150ms.
- **Outline:** borde de 1px en `filete`, fondo transparente, texto `negro-calido`; hover → `papel-bulo`.
- **Ghost:** sin borde ni fondo; hover → `papel-bulo`. Es la base de las acciones de fila (editar/eliminar aparecen en hover).
- **Destructive:** no es rojo sólido: fondo `oxido` al 10%, texto `oxido`, hover 20%. El rojo tiñe, no inunda.
- **Link:** texto `tinta` subrayado con offset 4px.

### Inputs / Fields
- **Style:** el input es una línea, no una caja: fondo transparente, sin borde lateral, solo **borde inferior de 1px** (`border-b-input`), padding `4px 0`, altura 40px. Label arriba en Label/Body, error debajo en FieldError.
- **Focus:** el borde inferior cambia a `ring` (cálido) — no hay glow ni caja de foco.
- **Error / Disabled:** `aria-invalid` tiñe el borde inferior de `oxido`; disabled baja a opacidad 50%. El toggle de visibilidad de contraseña es un icono ghost alineado a la derecha.

### Cards / Containers
- **Corner Style:** radio 0px.
- **Background:** `papel` (blanco puro) sobre el área de trabajo; la barra lateral usa `crema`.
- **Shadow Strategy:** `shadow-sm` + `ring-1 ring-foreground/5` (ver Elevation).
- **Border:** los módulos que no usan `Card` construyen su propio marco con `border border-border` de 1px.
- **Internal Padding:** 32px por defecto, 20px en `size="sm"`, 16px en las cajas de fila (TaskCard, WeeklyProgress).
- **CardTitle:** Playfair, 18px, semibold, UPPERCASE, tracking 0.025em — ancla la celda de papel con tipografía, no con color.

### Navigation
- **Sidebar:** fondo `crema`, filetes superior e inferior, ítems cuadrados de 36px con padding `8px 12px`; hover y activo comparten tratamiento (`bg-sidebar-accent` = papel de bulo, activo suma `font-medium`). Grupo con etiqueta "MENÚ" en Label/12px al 70% de opacidad. Colapsa a solo iconos con tooltip.
- **Header:** sticky, 56px, `background/80` + backdrop-blur-sm, trigger del sidebar + separador vertical + título actual en `muted-foreground` 14px.
- **Marca:** casilla de 32px (`bg-primary`, icono GraduationCap en `crema`, radio 0) + "DACATE" en Playfair semibold uppercase tracking 0.025em. El mismo lockup a distintas escalas es el logotipo del producto.
- **Logout:** ítem íntegro en `oxido` (texto e icono), sin fondo rojo.

### Chips (autenticación)
- **Style:** los chips de features ("TAREAS", "EXÁMENES"…) del panel de auth son texto en versalitas 10px sobre `primary-foreground/5` con borde `primary-foreground/20` de 1px, radio 0, padding `4px 12px`.

### Empty States
- **Style:** `EmptyMedia` con variante `icon` — casilla de 40px `bg-muted` con icono de 20px, radio 0; título en Playfair uppercase; descripción en `muted-foreground` 14px. Centrado, sin ilustración.

### Signature Components
- **TaskCard:** la celda atómica del producto. Fila de filete (`border border-border`, radio 0, padding 16px) con hover que oscurece el borde a `foreground/20`. Checkbox cuadrado a la izquierda; título 14px medium; metadatos en línea con dots de 6px (materia y prioridad) separados por `·` en `muted-foreground/40`; fecha vencida en `oxido` con icono de alerta; badge de estado a la derecha; acciones de editar/eliminar reveladas solo en hover (`opacity-0 group-hover:opacity-100`). Tareas completadas bajan a opacidad 60% con título tachado.
- **SectionHeader:** etiqueta en Label uppercase `muted-foreground` + enlace "Ver todo →" en `tinta` 12px a la derecha. Abre cada bloque del dashboard.
- **AuthLayout:** el panel de tinta a media pantalla con círculos decorativos al 10%, la cita en Playfair 24px y los chips en versalitas — la pieza más expresiva del sistema, usada solo en login/registro/recuperación.

## Do's and Don'ts

### Do:
- **Do** mantener radio 0px en cualquier componente nuevo (esquinas rectas de extremo a extremo).
- **Do** separar superficies con filetes de 1px en `filete` o anillos `ring-foreground/5`.
- **Do** poner en mayúsculas trackeadas (0.025–0.1em) toda etiqueta corta: botones, badges, encabezados de sección, títulos de tarjeta.
- **Do** usar Playfair Display solo en títulos, marca y estados vacíos; Noto Sans para todo lo operativo.
- **Do** usar `muted-foreground` (Gris Anotación) para metadatos y texto secundario, y `papel-bulo` como única superficie tonal de hover/reposo.
- **Do** reservar `oxido` para error, vencimiento, prioridad alta y acciones destructivas.
- **Do** dar foco visible con `ring` cálido (`anillo`) en todo control interactivo.

### Don't:
- **Don't** redondear esquinas ni introducir el look "productividad alegre redondeado" (esquinas tipo pastilla, burbujas, gradientes vibrantes, neón): es la anti-reference explícita de Dacate.
- **Don't** añadir sombra a tarjetas en reposo; la sombra es solo para overlays y respuestas de estado.
- **Don't** usar Playfair Display en párrafos, tablas, inputs ni listas de navegación.
- **Don't** usar el rojo `oxido` como color decorativo o de marca.
- **Don't** inventar acentos saturados (azules, morados, verdes de marca) fuera de la paleta papel/tinta/óxido; los dots de prioridad/media usan la gramática de color existente.
- **Don't** poner texto de cuerpo en mayúsculas ni micro-etiquetas en sentence case.
