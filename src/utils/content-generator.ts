import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { YouTubeVideo } from './youtube-fetcher';
import type { InstagramPost } from './instagram-fetcher';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_DIR = path.join(__dirname, '../content/blog');

function sanitizeFilename(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 100);
}

function escapeFrontmatter(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
}

function ensureContentDir(): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

function shouldUpdateFile(filePath: string, newContent: string): boolean {
  if (!fs.existsSync(filePath)) return true;
  return fs.readFileSync(filePath, 'utf-8') !== newContent;
}

export function generateYouTubeMarkdown(video: YouTubeVideo): boolean {
  try {
    ensureContentDir();
    const filename = `youtube-${video.id}.md`;
    const filePath = path.join(CONTENT_DIR, filename);
    const shortDesc = video.description.length > 200 ? video.description.substring(0, 200) + '...' : video.description;
    const content = `---
title: "${escapeFrontmatter(video.title)}"
date: ${new Date(video.publishedAt).toISOString().split('T')[0]}
contentType: youtube
youtubeId: "${video.id}"
youtubeUrl: "${video.url}"
image: "${video.thumbnail}"
description: "${escapeFrontmatter(shortDesc)}"
category: "Video"
author: "Bladimir Salazar"
videoDuration: "${video.duration}"
viewCount: ${video.viewCount}
tags: ["youtube", "video"]
---

${video.description}
`;
    if (shouldUpdateFile(filePath, content)) {
      fs.writeFileSync(filePath, content);
      console.log(`  Generated: ${filename}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error generating markdown for ${video.id}:`, error);
    return false;
  }
}

export function generateInstagramMarkdown(post: InstagramPost): boolean {
  try {
    ensureContentDir();
    const filename = `instagram-${post.id}.md`;
    const filePath = path.join(CONTENT_DIR, filename);
    const title = post.caption.length > 50 ? post.caption.substring(0, 50) + '...' : post.caption || 'Instagram Post';
    let category = 'Behind the Scenes';
    if (post.mediaType === 'VIDEO') category = 'Video';
    else if (post.mediaType === 'CAROUSEL_ALBUM') category = 'Galeria';
    const content = `---
title: "${escapeFrontmatter(title)}"
date: ${new Date(post.timestamp).toISOString().split('T')[0]}
contentType: instagram
instagramId: "${post.id}"
instagramUrl: "${post.permalink}"
instagramMediaType: ${post.mediaType}
image: "${post.mediaUrl}"
${post.mediaUrls.length > 1 ? `instagramImages:\n${post.mediaUrls.map(url => `  - "${url}"`).join('\n')}` : ''}
description: "${escapeFrontmatter(post.caption || 'Ver en Instagram')}"
category: "${category}"
author: "Bladimir Salazar"
tags: ["instagram"]
---

${post.caption}

[Ver post original en Instagram](${post.permalink})
`;
    if (shouldUpdateFile(filePath, content)) {
      fs.writeFileSync(filePath, content);
      console.log(`  Generated: ${filename}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error generating markdown for ${post.id}:`, error);
    return false;
  }
}

export function cleanupOldContent(youtubeIds: string[], instagramIds: string[]): void {
  try {
    ensureContentDir();
    const files = fs.readdirSync(CONTENT_DIR);
    files.forEach(file => {
      if (file.startsWith('youtube-') && file.endsWith('.md')) {
        const id = file.replace('youtube-', '').replace('.md', '');
        if (!youtubeIds.includes(id)) {
          fs.unlinkSync(path.join(CONTENT_DIR, file));
          console.log(`  Deleted: ${file}`);
        }
      }
      if (file.startsWith('instagram-') && file.endsWith('.md')) {
        const id = file.replace('instagram-', '').replace('.md', '');
        if (!instagramIds.includes(id)) {
          fs.unlinkSync(path.join(CONTENT_DIR, file));
          console.log(`  Deleted: ${file}`);
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up:', error);
  }
}