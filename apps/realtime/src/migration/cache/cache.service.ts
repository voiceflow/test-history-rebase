import { RedisService } from '@liaoliaots/nestjs-redis';
import { Inject } from '@nestjs/common';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import Redis from 'ioredis';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '@/config';

const MIGRATION_LOCK_EXPIRY_TIMEOUT = 15;

export class MigrationCacheService {
  private readonly redis: Redis;

  constructor(@Inject(RedisService) private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  public static getMigrationLockKey({ versionID }: { versionID: string }): string {
    return `migrate:${versionID}:lock`;
  }

  public static getActiveSchemaVersionKey({ versionID }: { versionID: string }): string {
    return `migrate:${versionID}:schema_version`;
  }

  public async acquireMigrationLock(versionID: string, nodeID: string): Promise<void> {
    const lockAcquired = (await this.redis.setnx(MigrationCacheService.getMigrationLockKey({ versionID }), nodeID)) === 1;

    if (!lockAcquired) {
      throw new Error('migration lock exists already');
    }

    await this.redis
      .pipeline()

      .expire(MigrationCacheService.getMigrationLockKey({ versionID }), MIGRATION_LOCK_EXPIRY_TIMEOUT)

      .unlink(MigrationCacheService.getActiveSchemaVersionKey({ versionID }))

      .exec();
  }

  public async resetMigrationLock(versionID: string): Promise<void> {
    await this.redis.unlink(MigrationCacheService.getMigrationLockKey({ versionID }));
  }

  public async setActiveSchemaVersion(versionID: string, targetSchemaVersion: Realtime.SchemaVersion): Promise<void> {
    await this.redis
      .pipeline()

      .set(MigrationCacheService.getActiveSchemaVersionKey({ versionID }), targetSchemaVersion)
      .expire(MigrationCacheService.getActiveSchemaVersionKey({ versionID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .unlink(MigrationCacheService.getMigrationLockKey({ versionID }))

      .exec();
  }

  public async getActiveSchemaVersion(versionID: string): Promise<Nullable<Realtime.SchemaVersion>> {
    const schemaVersion = await this.redis.get(MigrationCacheService.getActiveSchemaVersionKey({ versionID }));

    if (!schemaVersion) return null;

    return Number(schemaVersion) as Realtime.SchemaVersion;
  }

  public async isMigrationLocked(versionID: string): Promise<boolean> {
    return !!(await this.redis.get(MigrationCacheService.getMigrationLockKey({ versionID })));
  }

  public async renewActiveSchemaVersion(versionID: string): Promise<void> {
    await this.redis.expire(MigrationCacheService.getActiveSchemaVersionKey({ versionID }), HEARTBEAT_EXPIRE_TIMEOUT);
  }
}
