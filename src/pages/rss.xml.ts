import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL }) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: 'BS-OS — Blog de Bladimir Salazar',
    description: 'Cineasta y filmmaker chileno. Proyectos, tutoriales, y reflexiones sobre cine y creación audiovisual.',
    site: context.site ?? 'https://bladimirsalazar.com',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description ?? '',
      categories: post.data.tags ?? [],
      link: `/blog/${post.id.replace(/\.md$/, '')}/`,
    })),
    customData: `<language>es</language>`,
  });
}