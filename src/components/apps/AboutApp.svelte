<script lang="ts">
  interface Props {
    onOpenWindow?: (appId: string, props?: Record<string, any>) => void;
  }

  let { onOpenWindow }: Props = $props();
</script>

<div class="app-content win-scroll">
  <h1>🧑 Sobre Mí</h1>

  <p>
    Soy <strong>Bladimir Salazar</strong>, cineasta y filmmaker chileno. Trabajo en la intersección
    entre el cine, la animación 3D y la creación de contenido: ficción, documental, comedia y género.
  </p>

  <h2>Proyectos principales</h2>
  <ul>
    <li><strong>La Barrial</strong> — Serie de comedia para plataformas VOD. 🎬 <a href="https://labarrial.com" target="_blank" rel="noopener">labarrial.com</a></li>
    <li><strong>Akumu Films</strong> — Productora audiovisual: ficción, documental y todo tipo de contenido. 🎥 <a href="https://akumufilms.cl" target="_blank" rel="noopener">akumufilms.cl</a></li>
    <li><strong>Canal de YouTube</strong> — Tutoriales de Blender y contenido creativo. 🎮 <a href="https://www.youtube.com/@BladimirSalazar" target="_blank" rel="noopener">@BladimirSalazar</a></li>
    <li><strong>IMDB</strong> — Filmografía. 📋 <a href="https://www.imdb.com/name/nm1873474/" target="_blank" rel="noopener">nm1873474</a></li>
  </ul>

  <h2>Habilidades</h2>
  <ul>
    <li>Dirección y guion cinematográfico</li>
    <li>Animación y modelado 3D (Blender)</li>
    <li>Producción audiovisual independiente</li>
    <li>Color grading y postproducción</li>
    <li>Edición de video y motion graphics</li>
    <li>Desarrollo web (frontend) y diseño retro</li>
  </ul>

  <h2>Background</h2>
  <p>
    Chileno, originario de la zona central. Comencé con cortometrajes independientes y
    gradualmente construí una presencia en internet combinando cine tradicional con
    animación 3D. Fundé <strong>Akumu Films</strong> como el hogar creativo de mis
    proyectos — nació del suspenso y terror, pero hoy abarca ficción, documental y
    todo tipo de contenido — mientras que <strong>La Barrial</strong>, mi serie de
    comedia para VOD, explora el lado más ligero de lo cotidiano.
  </p>

  <p>
    En mi canal de YouTube comparto tutoriales de Blender y el proceso creativo detrás
    de mis producciones. Creo en la creación de contenido libre, replicable y accesible.
  </p>

  <h2>Contacto</h2>
  <p>
    📧 blax360.com@gmail.com<br />
    📍 Chile
  </p>
</div>