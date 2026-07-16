<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface NokiaResource {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    date: string;
    aiGenerated: boolean;
    link?: string;
  }

  interface Props {
    resources?: NokiaResource[];
  }

  let { resources: resourceEntries = [] }: Props = $props();

  type Screen = 'boot' | 'menu' | 'about' | 'projects' | 'blog' | 'blogpost' | 'contact' | 'social' | 'presskit' | 'resources' | 'help' | 'galaga';

  let currentScreen = $state<Screen>('boot');
  let selectedIndex = $state(0);
  let blogPostData: any = null;
  let bootTimer: ReturnType<typeof setTimeout>;

  const menuItems = [
    { id: 'about' as Screen, label: 'Sobre Mi', icon: '👤' },
    { id: 'projects' as Screen, label: 'Proyectos', icon: '📁' },
    { id: 'blog' as Screen, label: 'Blog', icon: '📝' },
    { id: 'resources' as Screen, label: 'Recursos', icon: '🎨' },
    { id: 'social' as Screen, label: 'Redes', icon: '🔗' },
    { id: 'contact' as Screen, label: 'Contacto', icon: '✉' },
    { id: 'presskit' as Screen, label: 'Press Kit', icon: '📋' },
    { id: 'help' as Screen, label: 'Ayuda', icon: '❓' },
    { id: 'galaga' as Screen, label: 'Cine Shooter', icon: '🎬' },
  ];

  const blogPosts = [
    {
      id: 'migrando-a-astro',
      title: 'Migrando de Astro a Vanilla JS con Canvas',
      date: '2026-02-25',
      excerpt: 'Por que temporalmente abandone Astro para construir el portafolio como una experiencia tipo Galaga usando HTML5 Canvas.',
      category: 'Desarrollo Web',
      body: 'Decidi tomar un descanso de Astro/Jekyll para construir este portafolio como una experiencia tipo Galaga. La idea era usar HTML5 Canvas para dibujar la nave, pixel por pixel, corriendo a 60fps.\n\nEl desafio mas grande fue hacer coexistir el DOM y el Canvas — necesitaba que las balas del juego detectaran colision con los elementos del menu HTML usando getBoundingClientRect(). Fue un experimento fascinante que me enseno mucho sobre como el navegador posiciona elementos.\n\nAhora, con BS-OS, vuelvo a Astro pero conservando ese espiritu de experimentacion visual. El escritorio Windows 3.1 es el lienzo, y cada "app" es una ventana a mi trabajo como filmmaker.',
    },
    {
      id: 'diseno-cinematografico-web',
      title: 'La Filosofia del Diseno Cinematografico en Web',
      date: '2026-01-10',
      excerpt: 'La web necesita mas drama. Cada click deberia sentir como el inicio de una pelicula.',
      category: 'Filmmaking',
      body: 'La web necesita mas drama. Akumu Films fue el inicio de mi exploracion del suspenso y terror como narrativas, pero ahora quiero llevar esa sensibilidad cinematografica al diseno web.\n\nCada click deberia sentir como el inicio de una pelicula. Las animaciones CSS (glitch, scanlines) no son solo decoracion — son herramientas narrativas que crean una experiencia visual y tactil.\n\nEl escritorio BS-OS es mi statement: un sitio web no tiene que ser una pagina plana. Puede ser un espacio que habitas, exploras, y donde descubres cosas. Como una pelicula, pero interactiva.',
    },
    {
      id: 'mi-camino-como-filmmaker',
      title: 'Mi camino como filmmaker: muchas derrotas, pero aqui sigo',
      date: '2025-02-12',
      excerpt: 'Una reflexion honesta sobre los altibajos de dedicarse al cine en Chile.',
      category: 'Personal',
      body: 'Este es un post personal. No voy a hablar de tecnica ni de software. Voy a hablar de lo que significa dedicarse al cine en Chile, de las derrotas, y de por que sigo aqui.\n\nLlevo anos en esto. He tenido proyectos que no se concretaron, financiamientos que no llegaron, puertas que se cerraron. Pero cada uno de esos fracasos me enseno algo que no habria aprendido de otra forma.\n\n"La Barrial" nacio de una de esas derrotas. Cuando un proyecto cae, el material emocional no se pierde — se transforma. Y de las cenizas de algo que no fue, surge algo que si puede ser.\n\nAkumu Films — "akumu" significa pesadilla en japones — nacio de mi fascinacion con el miedo. El miedo es la emocion mas honesta. No se puede fingir. Cuando algo te asusta de verdad, no hay filtro posible.\n\nSeguire haciendo lo que hago: contar historias, compartir conocimiento, y construir este rincon raro de internet donde el cine se encuentra con lo retro.',
    },
  ];

  const projects = [
    { title: 'La Barrial', category: 'Serie VOD · Comedia', desc: 'Serie de comedia independiente para plataformas VOD.', url: 'https://labarrial.com' },
    { title: 'Akumu Films', category: 'Productora · Cine y Documental', desc: 'Ficción, documental y todo tipo de contenido.', url: 'https://akumufilms.cl' },
    { title: 'YouTube', category: 'Canal · Tutoriales 3D', desc: 'Tutoriales de Blender y contenido creativo.', url: 'https://www.youtube.com/@BladimirSalazar' },
    { title: 'IMDB', category: 'Filmografia', desc: 'Perfil de filmografia en IMDb.', url: 'https://www.imdb.com/name/nm1873474/' },
  ];

  // Los recursos vienen de src/content/resources/*.md (pasados como prop desde OSLayout.astro)
  const resources = $derived(
    resourceEntries.map((r) => ({
      id: r.id,
      title: r.title,
      desc: r.description,
      category: r.category,
      tags: r.tags ?? [],
      ai: r.aiGenerated,
      link: r.link ?? '',
    }))
  );

  type ResourceFilter = 'Todos' | 'Tutoriales' | 'Descargas' | 'Assets';
  let resourceFilter = $state<ResourceFilter>('Todos');
  let filteredResources = $derived(
    resourceFilter === 'Todos' ? resources : resources.filter(r => r.category === resourceFilter)
  );

  const resourceFilters: ResourceFilter[] = ['Todos', 'Tutoriales', 'Descargas', 'Assets'];
  let resourceFilterIndex = $state(0);

  function getScreenTitle(): string {
    const titles: Record<string, string> = {
      boot: 'BS-OS',
      menu: 'Menu',
      about: 'Sobre Mi',
      projects: 'Proyectos',
      blog: 'Blog',
      blogpost: 'Blog',
      contact: 'Contacto',
      social: 'Redes',
      presskit: 'Press Kit',
      resources: 'Recursos',
      help: 'Ayuda',
      galaga: 'Cine Shooter',
    };
    return titles[currentScreen] ?? 'BS-OS';
  }

  function navigateUp() {
    if (currentScreen === 'menu') {
      selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
    } else if (currentScreen === 'blog') {
      selectedIndex = (selectedIndex - 1 + blogPosts.length) % blogPosts.length;
    } else if (currentScreen === 'resources') {
      selectedIndex = (selectedIndex - 1 + filteredResources.length) % filteredResources.length;
    } else if (currentScreen === 'projects') {
      selectedIndex = (selectedIndex - 1 + projects.length) % projects.length;
    }
  }

  function navigateDown() {
    if (currentScreen === 'menu') {
      selectedIndex = (selectedIndex + 1) % menuItems.length;
    } else if (currentScreen === 'blog') {
      selectedIndex = (selectedIndex + 1) % blogPosts.length;
    } else if (currentScreen === 'resources') {
      selectedIndex = (selectedIndex + 1) % filteredResources.length;
    } else if (currentScreen === 'projects') {
      selectedIndex = (selectedIndex + 1) % projects.length;
    }
  }

  function select() {
    if (currentScreen === 'menu') {
      const item = menuItems[selectedIndex];
      currentScreen = item.id;
      selectedIndex = 0;
    } else if (currentScreen === 'blog') {
      blogPostData = blogPosts[selectedIndex];
      currentScreen = 'blogpost';
    } else if (currentScreen === 'projects') {
      const p = projects[selectedIndex];
      window.open(p.url, '_blank', 'noopener');
    } else if (currentScreen === 'resources') {
      const r = filteredResources[selectedIndex];
      if (r.link) {
        window.open(r.link, '_blank', 'noopener');
      }
    }
  }

  function goBack() {
    if (currentScreen === 'blogpost') {
      currentScreen = 'blog';
      selectedIndex = blogPosts.findIndex(p => p.id === blogPostData?.id);
      if (selectedIndex < 0) selectedIndex = 0;
    } else if (currentScreen !== 'menu' && currentScreen !== 'boot') {
      currentScreen = 'menu';
      selectedIndex = 0;
    }
  }

  function cycleResourceFilter() {
    if (currentScreen === 'resources') {
      resourceFilterIndex = (resourceFilterIndex + 1) % resourceFilters.length;
      resourceFilter = resourceFilters[resourceFilterIndex];
      selectedIndex = 0;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (currentScreen === 'galaga') return;
    if (e.key === 'ArrowUp') { e.preventDefault(); navigateUp(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); navigateDown(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
    else if (e.key === 'Backspace' || e.key === 'Escape') { e.preventDefault(); goBack(); }
  }

  onMount(() => {
    bootTimer = setTimeout(() => {
      currentScreen = 'menu';
    }, 2000);
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    clearTimeout(bootTimer);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="nokia-body">
  <div class="nokia-phone">
    <!-- Speaker grille -->
    <div class="nokia-speaker">
      {#each Array(7) as _}
        <div class="nokia-speaker-dot"></div>
      {/each}
    </div>

    <!-- Brand -->
    <div class="nokia-brand">BS-OS</div>

    <!-- LCD Screen -->
    <div class="nokia-screen-wrap">
      <div class="nokia-screen">
        <!-- Status bar -->
        <div class="nokia-statusbar">
          <span class="nokia-statusbar-title">{getScreenTitle()}</span>
          <span class="nokia-statusbar-icons">
            {#if currentScreen !== 'boot'}
              {#if currentScreen === 'menu'}{''}{/if}
              📶
            {/if}
          </span>
        </div>

        <!-- Screen content -->
        <div class="nokia-content">
          {#if currentScreen === 'boot'}
            <div class="nokia-boot">
              <div class="nokia-boot-logo">BS-OS</div>
              <div class="nokia-boot-sub">Bladimir Salazar</div>
              <div class="nokia-boot-sub" style="font-size:13px;">Cargando...</div>
            </div>

          {:else if currentScreen === 'menu'}
            <ul class="nokia-menu">
              {#each menuItems as item, i}
                <li
                  class="nokia-menu-item {i === selectedIndex ? 'selected' : ''}"
                  onclick={() => { selectedIndex = i; select(); }}
                >
                  <span class="nokia-menu-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {#if i === selectedIndex}
                    <span class="nokia-menu-item-arrow">►</span>
                  {/if}
                </li>
              {/each}
            </ul>

          {:else if currentScreen === 'about'}
            <div class="nokia-view">
              <h1>Sobre Mi</h1>
              <p>Soy <strong>Bladimir Salazar</strong>, cineasta y filmmaker chileno. Trabajo en la interseccion entre el cine, la animacion 3D y la creacion de contenido: ficcion, documental, comedia y genero.</p>
              <h2>Proyectos</h2>
              <ul>
                <li><strong>La Barrial</strong> — Serie de comedia para VOD</li>
                <li><strong>Akumu Films</strong> — Productora: ficcion, documental y mas</li>
                <li><strong>YouTube</strong> — Tutoriales de Blender</li>
                <li><strong>IMDB</strong> — Filmografia</li>
              </ul>
              <h2>Habilidades</h2>
              <ul>
                <li>Direccion y guion cinematografico</li>
                <li>Animacion y modelado 3D (Blender)</li>
                <li>Produccion audiovisual independiente</li>
                <li>Color grading y postproduccion</li>
                <li>Edicion de video y motion graphics</li>
                <li>Desarrollo web y diseno retro</li>
              </ul>
              <h2>Contacto</h2>
              <p>📧 blax360.com@gmail.com<br>📍 Chile</p>
            </div>

          {:else if currentScreen === 'projects'}
            <div class="nokia-view">
              <h1>Proyectos</h1>
              {#each projects as p, i}
                <a
                  class="nokia-project-card {i === selectedIndex ? 'selected' : ''}"
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                >
                  <div class="nokia-card-title">{p.title}</div>
                  <div class="nokia-card-meta">{p.category}</div>
                  <div class="nokia-card-desc">{p.desc}</div>
                </a>
              {/each}
            </div>

          {:else if currentScreen === 'blog'}
            <div class="nokia-view">
              <h1>Blog</h1>
              {#each blogPosts as post, i}
                <div
                  class="nokia-card {i === selectedIndex ? 'selected' : ''}"
                  onclick={() => { selectedIndex = i; select(); }}
                >
                  <div class="nokia-card-title">{post.title}</div>
                  <div class="nokia-card-meta">{post.date} · {post.category}</div>
                  <div class="nokia-card-desc">{post.excerpt}</div>
                </div>
              {/each}
            </div>

          {:else if currentScreen === 'blogpost' && blogPostData}
            <div class="nokia-view">
              <h1>{blogPostData.title}</h1>
              <p style="font-size:14px;color:var(--nokia-text-light);">{blogPostData.date} · {blogPostData.category}</p>
              <hr class="nokia-divider">
              {#each blogPostData.body.split('\n\n') as para}
                <p>{para}</p>
              {/each}
            </div>

          {:else if currentScreen === 'resources'}
            <div class="nokia-view">
              <h1>Recursos</h1>
              <p style="font-size:15px;">Cada semana, recursos gratuitos para la comunidad filmmaker</p>
              <div class="nokia-filters">
                {#each resourceFilters as f, i}
                  <button
                    class="nokia-filter-btn {f === resourceFilter ? 'active' : ''}"
                    onclick={() => { resourceFilterIndex = i; resourceFilter = f; selectedIndex = 0; }}
                  >{f}</button>
                {/each}
              </div>
              {#each filteredResources as r, i}
                <div class="nokia-card {i === selectedIndex ? 'selected' : ''}">
                  <div class="nokia-card-title">{r.title}</div>
                  <div class="nokia-card-meta">{r.category}{#if r.ai} · <span class="nokia-ia-badge">IA</span>{/if}</div>
                  <div class="nokia-card-desc">{r.desc}</div>
                  <div class="nokia-tags">{r.tags.join(', ')}</div>
                  {#if r.link}
                    <a class="nokia-download-btn" href={r.link} target="_blank" rel="noopener">Descargar</a>
                  {/if}
                </div>
              {/each}
              <p style="font-size:14px;">
                Todo esto es gratis gracias a quienes me apoyan.
                ¿Quieres sumarte? <a href="https://www.patreon.com/blax360" target="_blank" rel="noopener">Patreon</a>
                · <a href="https://ko-fi.com/blax360" target="_blank" rel="noopener">Ko-Fi</a> ❤
              </p>
            </div>

          {:else if currentScreen === 'social'}
            <div class="nokia-view">
              <h1>Redes Sociales</h1>
              <a class="nokia-social-link" href="https://www.youtube.com/@BladimirSalazar" target="_blank" rel="noopener">
                <span class="nokia-social-link-icon">▶</span>
                <span>YouTube · @BladimirSalazar</span>
              </a>
              <a class="nokia-social-link" href="https://www.patreon.com/blax360" target="_blank" rel="noopener">
                <span class="nokia-social-link-icon">❤</span>
                <span>Patreon · blax360</span>
              </a>
              <a class="nokia-social-link" href="https://ko-fi.com/blax360" target="_blank" rel="noopener">
                <span class="nokia-social-link-icon">☕</span>
                <span>Ko-Fi · blax360</span>
              </a>
              <a class="nokia-social-link" href="https://www.instagram.com/blax360" target="_blank" rel="noopener">
                <span class="nokia-social-link-icon">📷</span>
                <span>Instagram · @blax360</span>
              </a>
              <a class="nokia-social-link" href="https://www.imdb.com/name/nm1873474/" target="_blank" rel="noopener">
                <span class="nokia-social-link-icon">🎬</span>
                <span>IMDB · nm1873474</span>
              </a>
            </div>

          {:else if currentScreen === 'contact'}
            <div class="nokia-view">
              <h1>Contacto</h1>
              <form class="nokia-form" name="contact" method="POST" action="/gracias" data-netlify="true">
                <input type="hidden" name="form-name" value="contact" />
                <label>Nombre</label>
                <input class="nokia-input" type="text" name="name" placeholder="Tu nombre" />
                <label>Email</label>
                <input class="nokia-input" type="email" name="email" placeholder="tu@email.com" />
                <label>Asunto</label>
                <input class="nokia-input" type="text" name="subject" placeholder="Asunto" />
                <label>Mensaje</label>
                <textarea class="nokia-textarea" name="message" placeholder="Escribe tu mensaje..."></textarea>
                <button class="nokia-submit-btn" type="submit">Enviar</button>
              </form>
              <hr class="nokia-divider">
              <p>Tambien puedes escribir a:<br><a href="mailto:blax360.com@gmail.com">blax360.com@gmail.com</a></p>
            </div>

          {:else if currentScreen === 'presskit'}
            <div class="nokia-view">
              <h1>Press Kit</h1>
              <h2>Bio</h2>
              <p>Bladimir Salazar es un cineasta y filmmaker chileno. Creador de <em>La Barrial</em>, serie de comedia para plataformas VOD, y fundador de <em>Akumu Films</em>, productora audiovisual que abarca ficcion, documental y todo tipo de contenido.</p>
              <h2>Filmografia</h2>
              <ul>
                <li>La Barrial — Serie de comedia para VOD</li>
                <li>Akumu Films — Ficcion, documental y contenido de genero</li>
                <li>Tutoriales Blender — YouTube</li>
              </ul>
              <p>Ver filmografia completa en <a href="https://www.imdb.com/name/nm1873474/" target="_blank" rel="noopener">IMDB</a>.</p>
              <h2>Contacto</h2>
              <p>📧 <a href="mailto:blax360.com@gmail.com">blax360.com@gmail.com</a><br>📍 Chile</p>
              <h2>Assets de prensa</h2>
              <p>Para solicitar assets de prensa, escribir a <a href="mailto:blax360.com@gmail.com">blax360.com@gmail.com</a>.</p>
            </div>

          {:else if currentScreen === 'help'}
            <div class="nokia-view">
              <h1>Ayuda</h1>
              <h2>BS-OS v1.0</h2>
              <p>Bienvenido a BS-OS, el sitio de Bladimir Salazar.</p>
              <h2>Como navegar</h2>
              <ul>
                <li>Usa <strong>arriba/abajo</strong> para moverte</li>
                <li><strong>Seleccionar</strong> para abrir</li>
                <li><strong>Atras</strong> para volver al menu</li>
                <li>Toca un item para abrirlo</li>
              </ul>
              <h2>Contenido</h2>
              <ul>
                <li>Sobre Mi — Mi bio y habilidades</li>
                <li>Proyectos — Mis trabajos</li>
                <li>Blog — Articulos y reflexiones</li>
                <li>Recursos — Descargas y tutoriales</li>
                <li>Redes — YouTube, Patreon, Instagram</li>
                <li>Contacto — Escribeme</li>
              </ul>
              <p style="margin-top:12px;font-size:14px;color:var(--nokia-text-light);">© 2026 Bladimir Salazar · Hecho en Chile</p>
            </div>

          {:else if currentScreen === 'galaga'}
            <div class="nokia-view" style="text-align:center;padding-top:20px;">
              <h1>Cine Shooter</h1>
              <p style="font-size:16px;">El juego se abre en pantalla completa.</p>
              <p style="font-size:15px;color:var(--nokia-text-light);">Visita este sitio desde un computador para jugar Cine Shooter con teclado.</p>
              <p style="font-size:14px;margin-top:16px;">O abre el juego directamente:</p>
              <a class="nokia-download-btn" href="/?game=galaga" style="margin-top:8px;">Abrir juego</a>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Soft keys -->
    <div class="nokia-softkeys">
      <button class="nokia-softkey" onclick={goBack}>
        {#if currentScreen !== 'menu'}Atras{/if}
      </button>
      <span class="nokia-softkey-center">BS-OS</span>
      <button class="nokia-softkey" onclick={select}>Seleccionar</button>
    </div>

    <!-- D-pad and nav buttons -->
    <div class="nokia-keypad">
      <div class="nokia-nav-row">
        <div class="nokia-dpad">
          <button class="nokia-dpad-btn nokia-dpad-up" onclick={navigateUp}>▲</button>
          <button class="nokia-dpad-btn nokia-dpad-left" onclick={() => { if (currentScreen === 'resources') cycleResourceFilter(); }}>◄</button>
          <button class="nokia-dpad-btn nokia-dpad-center" onclick={select}>OK</button>
          <button class="nokia-dpad-btn nokia-dpad-right" onclick={() => { if (currentScreen === 'resources') cycleResourceFilter(); }}>►</button>
          <button class="nokia-dpad-btn nokia-dpad-down" onclick={navigateDown}>▼</button>
        </div>
      </div>
    </div>
  </div>
</div>