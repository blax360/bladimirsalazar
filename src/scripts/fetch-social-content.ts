import dotenv from 'dotenv';
import { fetchYouTubeVideos } from '../utils/youtube-fetcher';
import { fetchInstagramPosts } from '../utils/instagram-fetcher';
import { generateYouTubeMarkdown, generateInstagramMarkdown, cleanupOldContent } from '../utils/content-generator';

dotenv.config();

async function main() {
  console.log('Starting social media content fetch...');

  if (process.env.SKIP_API_FETCH === 'true') {
    console.log('SKIP_API_FETCH is true, skipping API calls');
    process.exit(0);
  }

  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  const youtubeChannelId = process.env.YOUTUBE_CHANNEL_ID;
  const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramUserId = process.env.INSTAGRAM_USER_ID;

  let youtubeVideos: any[] = [];
  let instagramPosts: any[] = [];

  if (youtubeApiKey && youtubeChannelId) {
    try {
      youtubeVideos = await fetchYouTubeVideos(youtubeApiKey, youtubeChannelId);
      if (youtubeVideos.length > 0) {
        let generated = 0;
        youtubeVideos.forEach(video => { if (generateYouTubeMarkdown(video)) generated++; });
        console.log(`Generated/updated ${generated} YouTube content files`);
      }
    } catch (error) {
      console.error('YouTube fetch failed:', error);
    }
  } else {
    console.log('YouTube credentials not configured, skipping');
  }

  if (instagramAccessToken && instagramUserId) {
    try {
      instagramPosts = await fetchInstagramPosts(instagramAccessToken, instagramUserId);
      if (instagramPosts.length > 0) {
        let generated = 0;
        instagramPosts.forEach(post => { if (generateInstagramMarkdown(post)) generated++; });
        console.log(`Generated/updated ${generated} Instagram content files`);
      }
    } catch (error) {
      console.error('Instagram fetch failed:', error);
    }
  } else {
    console.log('Instagram credentials not configured, skipping');
  }

  cleanupOldContent(youtubeVideos.map(v => v.id), instagramPosts.map(p => p.id));

  console.log(`\nSummary: ${youtubeVideos.length} YouTube videos, ${instagramPosts.length} Instagram posts`);
  process.exit(0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(0);
});