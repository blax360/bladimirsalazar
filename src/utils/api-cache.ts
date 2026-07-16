import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, '../../.cache');
const CACHE_DURATION = 60 * 60 * 1000;

export interface CacheData<T> {
  data: T;
  timestamp: number;
}

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function getCachedData<T>(key: string): T | null {
  try {
    ensureCacheDir();
    const cachePath = path.join(CACHE_DIR, `${key}.json`);
    if (!fs.existsSync(cachePath)) return null;
    const fileContent = fs.readFileSync(cachePath, 'utf-8');
    const cacheData: CacheData<T> = JSON.parse(fileContent);
    const age = Date.now() - cacheData.timestamp;
    if (age < CACHE_DURATION) {
      console.log(`Using cached data for ${key} (age: ${Math.round(age / 1000 / 60)}m)`);
      return cacheData.data;
    }
    return null;
  } catch (error) {
    console.error(`Error reading cache for ${key}:`, error);
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  try {
    ensureCacheDir();
    const cachePath = path.join(CACHE_DIR, `${key}.json`);
    const cacheData: CacheData<T> = { data, timestamp: Date.now() };
    fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.error(`Error writing cache for ${key}:`, error);
  }
}

export function clearCache(key: string): void {
  try {
    const cachePath = path.join(CACHE_DIR, `${key}.json`);
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
    }
  } catch (error) {
    console.error(`Error clearing cache for ${key}:`, error);
  }
}