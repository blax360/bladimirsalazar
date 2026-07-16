<script lang="ts">
  interface BlogPost {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    type: 'markdown';
    category: string;
  }

  interface Props {
    onOpenWindow?: (appId: string, props?: Record<string, any>) => void;
  }

  let { onOpenWindow }: Props = $props();

  const posts: BlogPost[] = [
    {
      id: 'migrando-a-astro',
      title: 'Migrando de Astro a Vanilla JS con Canvas',
      date: '2026-02-25',
      excerpt: 'Por qué temporalmente abandoné Astro para construir el portafolio como una experiencia tipo Galaga usando HTML5 Canvas.',
      type: 'markdown',
      category: 'Desarrollo Web',
    },
    {
      id: 'diseno-cinematografico-web',
      title: 'La Filosofía del Diseño Cinematográfico en Web',
      date: '2026-01-10',
      excerpt: 'La web necesita más drama. Cada click debería sentir como el inicio de una película.',
      type: 'markdown',
      category: 'Filmmaking',
    },
    {
      id: 'mi-camino-como-filmmaker',
      title: 'Mi camino como filmmaker: muchas derrotas, pero aquí sigo',
      date: '2025-02-12',
      excerpt: 'Una reflexión honesta sobre los altibajos de dedicarse al cine en Chile.',
      type: 'markdown',
      category: 'Personal',
    },
  ];

  function openPost(post: BlogPost) {
    onOpenWindow?.('blogpost', { post });
  }
</script>

<div class="app-content win-scroll">
  <h1>📝 Blog</h1>

  <div class="blog-list">
    {#each posts as post (post.id)}
      <div class="blog-card" onclick={() => openPost(post)} role="button" tabindex="0" onkeydown={(e) => { if (e.key === 'Enter') openPost(post); }}>
        <div class="blog-card-title">{post.title}</div>
        <div class="blog-card-meta">
          <span>{post.date}</span>
          <span class="blog-card-badge {post.type}">{post.category}</span>
        </div>
        <div style="font-size:12.5px; color:var(--win-text-disabled);">{post.excerpt}</div>
      </div>
    {/each}
  </div>
</div>