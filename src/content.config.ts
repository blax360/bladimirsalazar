import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().optional().default('Bladimir Salazar'),
    image: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional().default('General'),
    contentType: z.enum(['markdown', 'youtube', 'instagram']).default('markdown'),
    youtubeId: z.string().optional(),
    youtubeUrl: z.string().optional(),
    videoDuration: z.string().optional(),
    viewCount: z.number().optional(),
    instagramId: z.string().optional(),
    instagramUrl: z.string().optional(),
    instagramMediaType: z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM']).optional(),
    instagramImages: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    link: z.string().url().optional(),
    image: z.string().optional(),
    year: z.number().optional(),
    role: z.string().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Tutoriales', 'Descargas', 'Assets']).default('Descargas'),
    link: z.string().optional(),
    manualLink: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date: z.coerce.date(),
    aiGenerated: z.boolean().default(true),
    author: z.string().optional().default('Bladimir Salazar'),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/settings' }),
  schema: z.object({
    siteName: z.string().optional(),
    bio: z.string().optional(),
    email: z.string().optional(),
    location: z.string().optional(),
    youtubeUrl: z.string().optional(),
    patreonUrl: z.string().optional(),
    kofiUrl: z.string().optional(),
    instagramUrl: z.string().optional(),
    imdbUrl: z.string().optional(),
    errorMessages: z.array(z.string()).optional(),
    // Fondo del escritorio: ruta a una imagen (ej. "/assets/wallpaper.jpg").
    // Vacío = fondo verde azulado clásico.
    wallpaper: z.string().optional(),
    // ID del video de YouTube que abre el Reproductor al cargar el sitio.
    // Vacío = el reproductor no se abre solo.
    showreelYoutubeId: z.string().optional(),
    showreelTitle: z.string().optional(),
  }),
});

export const collections = { blog, projects, resources, settings };