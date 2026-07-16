<script lang="ts">
  interface Project {
    title: string;
    category: string;
    description: string;
    url: string;
  }

  const projects: Project[] = [
    {
      title: 'La Barrial',
      category: 'Serie VOD · Comedia',
      description: 'Serie de comedia independiente para plataformas VOD, con personajes cotidianos. Producción, dirección y edición.',
      url: 'https://labarrial.com',
    },
    {
      title: 'Akumu Films',
      category: 'Productora · Cine y Documental',
      description: 'Productora audiovisual: ficción, documental y todo tipo de contenido. Nació del suspenso y terror, hoy abarca mucho más.',
      url: 'https://akumufilms.cl',
    },
    {
      title: 'YouTube · @BladimirSalazar',
      category: 'Canal · Tutoriales 3D',
      description: 'Tutoriales de Blender, procesos creativos, y contenido sobre producción audiovisual.',
      url: 'https://www.youtube.com/@BladimirSalazar',
    },
    {
      title: 'IMDB',
      category: 'Filmografía',
      description: 'Perfil de filmografía en IMDb. Cortometrajes, series y créditos de producción.',
      url: 'https://www.imdb.com/name/nm1873474/',
    },
  ];
</script>

<div class="app-content win-scroll">
  <h1>📂 Proyectos</h1>
  <p style="margin-bottom: 12px;">Una selección de mis trabajos y canales principales.</p>

  <div class="projects-grid">
    {#each projects as p}
      <a class="project-card" href={p.url} target="_blank" rel="noopener">
        <div class="project-card-category">{p.category}</div>
        <div class="project-card-title">{p.title}</div>
        <div class="project-card-desc">{p.description}</div>
      </a>
    {/each}
  </div>
</div>