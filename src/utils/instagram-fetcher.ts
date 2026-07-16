import { getCachedData, setCachedData } from './api-cache';

export interface InstagramPost {
  id: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  mediaUrls: string[];
  permalink: string;
  timestamp: string;
}

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';

export async function fetchInstagramPosts(
  accessToken: string,
  userId: string,
  limit: number = 25
): Promise<InstagramPost[]> {
  try {
    console.log('Fetching Instagram posts...');
    const cached = getCachedData<InstagramPost[]>('instagram');
    if (cached) return cached;

    const fields = 'id,caption,media_type,media_url,permalink,timestamp,children{media_url}';
    const response = await fetch(
      `${INSTAGRAM_API_BASE}/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400 && errorData.error?.code === 190) {
        throw new Error('Instagram token expired. Refresh required.');
      }
      throw new Error(`Instagram API error: ${response.status}`);
    }
    const data = await response.json();
    if (!data.data?.length) return [];

    const posts: InstagramPost[] = data.data.map((item: any) => {
      const mediaUrls: string[] = [];
      if (item.media_type === 'CAROUSEL_ALBUM' && item.children?.data) {
        mediaUrls.push(...item.children.data.map((child: any) => child.media_url));
      } else {
        mediaUrls.push(item.media_url);
      }
      return {
        id: item.id,
        caption: item.caption || '',
        mediaType: item.media_type,
        mediaUrl: item.media_url,
        mediaUrls,
        permalink: item.permalink,
        timestamp: item.timestamp,
      };
    });

    setCachedData('instagram', posts);
    console.log(`Fetched ${posts.length} Instagram posts`);
    return posts;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    const cached = getCachedData<InstagramPost[]>('instagram');
    if (cached) return cached;
    return [];
  }
}