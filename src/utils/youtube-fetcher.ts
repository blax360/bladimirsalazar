import { getCachedData, setCachedData } from './api-cache';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  url: string;
}

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export async function fetchYouTubeVideos(
  apiKey: string,
  channelId: string,
  maxResults: number = 50
): Promise<YouTubeVideo[]> {
  try {
    console.log('Fetching YouTube videos...');
    const cachedVideos = getCachedData<YouTubeVideo[]>('youtube');
    if (cachedVideos) return cachedVideos;

    const channelResponse = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    if (!channelResponse.ok) throw new Error(`YouTube API error: ${channelResponse.status}`);
    const channelData = await channelResponse.json();
    if (!channelData.items?.length) throw new Error('Channel not found');

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    const playlistResponse = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`
    );
    if (!playlistResponse.ok) throw new Error(`YouTube API error: ${playlistResponse.status}`);
    const playlistData = await playlistResponse.json();
    if (!playlistData.items?.length) return [];

    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
    const videosResponse = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=contentDetails,statistics&id=${videoIds}&key=${apiKey}`
    );
    if (!videosResponse.ok) throw new Error(`YouTube API error: ${videosResponse.status}`);
    const videosData = await videosResponse.json();

    const videos: YouTubeVideo[] = playlistData.items.map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      const details = videosData.items.find((v: any) => v.id === videoId);
      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        publishedAt: item.snippet.publishedAt,
        duration: details ? formatDuration(details.contentDetails.duration) : '0:00',
        viewCount: details ? parseInt(details.statistics.viewCount) : 0,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });

    setCachedData('youtube', videos);
    console.log(`Fetched ${videos.length} YouTube videos`);
    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    const cached = getCachedData<YouTubeVideo[]>('youtube');
    if (cached) return cached;
    return [];
  }
}