import { BookDocument } from '~/features/book/book.model';
import RedisCache from '~/shared/cache/redis.cache';
import { REDIS_KEY } from '~/shared/constants/redisKeys';

const redisCache: RedisCache = new RedisCache();

class BookCache {
  private readonly DEFAULT_TTL = 3600; // 1 hour in seconds

  public async get<T>(key: string): Promise<T | null> {
    const cachedData = await redisCache.client.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  public async set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): Promise<void> {
    await redisCache.client.setEx(key, ttl, JSON.stringify(data));
  }

  public async del(key: string): Promise<void> {
    await redisCache.client.del(key);
  }

  public async getBooks(key: string): Promise<BookDocument[] | null> {
    return this.get<BookDocument[]>(key);
  }

  public async deleteByPattern(pattern: string): Promise<void> {
    const keys: string[] = [];
    for await (const key of redisCache.client.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      keys.push(key);
    }

    console.log('Delete by pattern, keys: ', keys)

    if (keys.length > 0) await redisCache.client.del(keys);
  }

  public async invalidateBooks(): Promise<void> {
    await this.deleteByPattern(`${REDIS_KEY.BOOKS}:*`);
  }
}

export const bookCache: BookCache = new BookCache();
