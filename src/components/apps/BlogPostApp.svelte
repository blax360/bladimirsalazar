<script lang="ts">
  interface Post {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    type: 'markdown';
    category: string;
  }

  interface Props {
    post: Post;
    onOpenWindow?: (appId: string, props?: Record<string, any>) => void;
  }

  let { post, onOpenWindow }: Props = $props();
</script>

<div class="app-content win-scroll">
  <div style="margin-bottom:12px;">
    <button class="btn-win" onclick={() => onOpenWindow?.('blog')}>← Volver al Blog</button>
  </div>

  <article class="prose-win">
    <h1>{post?.title ?? 'Post'}</h1>
    <p style="color:var(--win-text-disabled); font-size:11px; margin-bottom:16px;">
      {post?.date} · <span class="blog-card-badge {post?.type}">{post?.category}</span>
    </p>

    {#if post?.excerpt}
      <p>{post.excerpt}</p>
    {/if}
  </article>

  <div style="margin-top:24px;">
    <button class="btn-win" onclick={() => onOpenWindow?.('blog')}>← Volver al Blog</button>
  </div>
</div>