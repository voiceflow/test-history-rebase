/* eslint-disable no-await-in-loop */
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ReferenceCacheService {
  private readonly redis: Redis;

  // i hope 2 mins is enough to build all references for a single project
  private LOCK_EXPIRY_TIMEOUT = 60 * 2;

  // depends how good is our reference sync system we can adjust this value
  private REFERENCE_EXPIRY_TIMEOUT = 60 * 15;

  private getLockKey = ({ environmentID }: { environmentID: string }): string => `reference:${environmentID}:lock`;

  private getExpireKey = ({ environmentID }: { environmentID: string }): string => `reference:${environmentID}:expire`;

  constructor(@Inject(RedisService) private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  public async acquireLock(environmentID: string): Promise<void> {
    const lockAcquired = (await this.redis.setnx(this.getLockKey({ environmentID }), 1)) === 1;

    if (!lockAcquired) {
      throw new Error('reference lock exists already');
    }

    await this.redis
      .pipeline()

      .expire(this.getLockKey({ environmentID }), this.LOCK_EXPIRY_TIMEOUT)

      .unlink(this.getExpireKey({ environmentID }))

      .exec();
  }

  public async isLocked(environmentID: string): Promise<boolean> {
    return !!(await this.redis.get(this.getLockKey({ environmentID })));
  }

  public async waitUntilUnlocked(environmentID: string): Promise<void> {
    while (true) {
      const isLocked = await this.isLocked(environmentID);

      if (!isLocked) return;

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }
  }

  public async setExpire(environmentID: string): Promise<void> {
    await this.redis
      .pipeline()
      .set(this.getExpireKey({ environmentID }), 1)
      .expire(this.getExpireKey({ environmentID }), this.REFERENCE_EXPIRY_TIMEOUT)

      .unlink(this.getLockKey({ environmentID }))

      .exec();
  }

  public async isValid(environmentID: string): Promise<boolean> {
    const result = await this.redis.get(this.getExpireKey({ environmentID }));

    return !!result;
  }

  public async resetLockAndExpire(environmentID: string): Promise<void> {
    await this.redis
      .pipeline()
      .unlink(this.getLockKey({ environmentID }))
      .unlink(this.getExpireKey({ environmentID }))
      .exec();
  }
}
