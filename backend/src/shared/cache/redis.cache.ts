import Logger from 'bunyan';
import { createClient, RedisClientType } from 'redis';
import { config } from '~/config';

const log: Logger = config.createLogger('redis');

class RedisCache {
  public client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: config.REDIS_HOST
    });

    this.client.on('connect', () => log.info('🟢 Redis connected successfully'));

    this.client.on('ready', () => log.info('✅ Redis is ready for commands'));

    this.client.on('error', (err: any) => log.error('🔴 Redis client error:', err));

    this.client.connect().catch((err) => log.error('Redis connection failed:', err));
  }
}

export default RedisCache;
