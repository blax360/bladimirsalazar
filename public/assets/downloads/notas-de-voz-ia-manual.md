# 📝 Notas de Voz IA — Manual de uso

Graba una nota por voz, deja que la IA la clasifique y la reescriba según su tipo, y guárdala automáticamente como nota Markdown en tu vault de Obsidian, con un título ordenado al estilo **PARA** de Tiago Forte.

Todo el procesamiento de IA ocurre **en tu dispositivo** (Apple Intelligence). No se envía nada a internet.

---

## ✅ Requisitos

| Requisito | Detalle |
|-----------|---------|
| **Dispositivo** | iPhone, iPad o Mac compatible con **Apple Intelligence** |
| **iOS/iPadOS/macOS** | Versión reciente con Apple Intelligence activado (Ajustes → Apple Intelligence y Siri) |
| **Idioma** | El del sistema; la IA responde en el mismo idioma en que dictes |
| **App Obsidian** (opcional pero recomendado) | Para leer las notas guardadas. Sirve cualquier carpeta si no usas Obsidian |
| **Micrófono y dictado** | Permiso de micrófono concedido a Atajos |

> ⚠️ Si tu dispositivo no tiene Apple Intelligence, la acción **Usar Modelo de IA** no funcionará. Consulta la sección *Solución de problemas*.

---

## 🚀 Instalación

1. Toca dos veces el archivo **`Notas de Voz IA.shortcut`** o compártelo a tu dispositivo (AirDrop, iCloud, etc.).
2. Se abrirá la app **Atajos** con la vista previa. Pulsa **Añadir atajo**.
3. La primera vez que lo ejecutes, iOS pedirá permisos (micrófono, guardar archivos). Acéptalos.

---

## ▶️ Cómo usarlo (paso a paso)

1. **Ejecuta el atajo** — desde la app Atajos, un widget, la pantalla de inicio, o diciéndole a Siri *"Notas de Voz IA"*.
2. **Dicta tu nota.** Empieza a hablar en cuanto se abra el dictado.
3. **Toca la pantalla** cuando termines de hablar (así se detiene la escucha).
4. Espera unos segundos: la IA clasifica y reescribe la nota en tu dispositivo.
5. **La primera vez**, te preguntará **dónde guardar** → elige la carpeta de tu **vault de Obsidian**. En ejecuciones futuras reutiliza esa ruta.
6. Verás una notificación **"Nota guardada"** con el título de la nota. ✅

---

## 🧠 Qué hace la IA con tu nota

El atajo detecta automáticamente **uno de estos tres tipos** y aplica un tratamiento distinto:

| Tipo | Cuándo se aplica | Qué hace la IA |
|------|------------------|----------------|
| **A — Historia / Film / Serie** | Idea narrativa o de guion | Le da estructura tipo **"Save the Cat"** (beats principales), actúa como *script doctor* crítico señalando debilidades y giros posibles, y sugiere fuentes de inspiración |
| **B — Idea para recordar** | Nota, recordatorio o reflexión | La formatea de forma clara (títulos, viñetas) y añade sugerencias como experto en la materia (deporte, wellness, espiritualidad, etc.) |
| **C — Vídeo YouTube / Instagram / Patreon** | Idea de contenido | Actúa como experto crítico en YouTube: mejora la idea, encuentra la estructura ideal y da los puntos clave para el guion |

En **todos los casos**:
- Termina con una línea de **5 a 10 hashtags** relevantes.
- La **primera línea es el título** con formato PARA: `Projects` / `Areas` / `Resources` / `Archive` + ` - ` + nombre corto.
  - Ejemplo: `Resources - Estructura Save the Cat para thriller psicológico`
- El resto es el cuerpo en **Markdown limpio**.

El **título** se convierte en el **nombre del archivo** (`.md`), tras limpiar caracteres no válidos (`/ \ : ? " < > | *`).

---

## ⚙️ Cómo funciona por dentro

Secuencia de acciones del atajo:

1. **Dictar Texto** — escucha por voz, se detiene al tocar la pantalla → variable `Transcripcion`
2. **Texto** — construye el prompt completo (instrucciones + tu transcripción)
3. **Usar Modelo de IA** — Apple Intelligence procesa el prompt en el dispositivo → variable `Respuesta IA`
4. **Dividir Texto** por líneas + **Obtener primer elemento** → el título
5. **Reemplazar Texto** (×3) — quita el prefijo `TITULO:` y los caracteres inválidos para nombres de archivo → variable `Titulo`
6. **Texto** — compone el nombre `Titulo.md`
7. **Establecer Nombre** — pone ese nombre al contenido `Respuesta IA`
8. **Guardar Archivo** — lo guarda en tu carpeta de Obsidian
9. **Mostrar Notificación** — confirma con el título

---

## 🛠️ Personalización

Abre el atajo en Atajos → **Editar** para ajustar:

- **Prompt / instrucciones:** edita la acción **Texto** (la larga, justo antes de *Usar Modelo de IA*) para cambiar categorías, estilo o idioma. **No borres** el marcador de la variable `Transcripcion` al final.
- **Carpeta de guardado:** en la acción **Guardar Archivo**, si desactivas *"Preguntar dónde guardar"* puedes fijar una ruta concreta; o ejecútalo una vez más para reelegir carpeta.
- **Categoría PARA / hashtags:** se controlan desde el mismo prompt.
- **Detener dictado:** en *Dictar Texto*, la opción *"Dejar de escuchar"* está en **Al tocar**; puedes cambiarla a *Tras pausa* o un tiempo fijo.

---

## 🩹 Solución de problemas

| Problema | Causa / Solución |
|----------|------------------|
| **"Usar Modelo de IA" falla o no aparece** | El dispositivo no tiene Apple Intelligence activado o no es compatible. Actívalo en Ajustes, o sustituye esa acción por otra app de IA (ver abajo) |
| **No transcribe la voz** | Revisa el permiso de micrófono de Atajos y que el dictado esté disponible en tu idioma |
| **Pide carpeta cada vez** | Es normal solo la primera vez. Si se repite, vuelve a guardar la ruta o fija una en la acción *Guardar Archivo* |
| **El título sale raro o vacío** | La IA no devolvió una primera línea como título. Reintenta dictando más claro, o ajusta el prompt |
| **Nombre de archivo con caracteres extraños** | Ya se limpian `/ \ : ? " < > \| *`; si aparecen otros, añade una acción *Reemplazar Texto* extra |

### Usar otra app de IA en lugar de Apple Intelligence

El atajo usa **Usar Modelo de IA (Apple Intelligence)** porque es on-device y sin apps externas. Si prefieres otro modelo (p. ej. una app que exponga una acción tipo *Ask / Chat / Generate Text*):

1. Edita el atajo.
2. **Reemplaza** la acción *Usar Modelo de IA* por la acción de esa app.
3. Pásale como entrada el mismo **Texto** (el prompt construido).
4. Guarda su salida en la variable **`Respuesta IA`** para que el resto del flujo siga funcionando.

---

## 🔒 Privacidad

- El procesamiento se hace **localmente** con Apple Intelligence: tu nota **no sale del dispositivo**.
- La nota se guarda solo en la carpeta que tú elijas (tu vault de Obsidian).

---

*Atajo generado con Shortcuts Playground. Puede contener errores — revisa siempre las acciones del atajo antes de confiar en él.*
