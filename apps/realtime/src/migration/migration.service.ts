import { BaseVersion } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { CacheService } from '@/cache/cache.service';
import { HEARTBEAT_EXPIRE_TIMEOUT } from '@/constants';
import { ProjectService } from '@/project/project.service';

import { MigrationState } from './migration.enum';

const MIGRATION_LOCK_EXPIRY_TIMEOUT = 15;

export class MigrationService {
  constructor(private cacheService: CacheService, private projectService: ProjectService) {}

  public static getMigrationLockKey({ versionID }: { versionID: string }): string {
    return `migrate:${versionID}:lock`;
  }

  public static getActiveSchemaVersionKey({ versionID }: { versionID: string }): string {
    return `migrate:${versionID}:schema_version`;
  }

  public async acquireMigrationLock(versionID: string, nodeID: string): Promise<void> {
    const lockAcquired = (await this.cacheService.redis.setnx(MigrationService.getMigrationLockKey({ versionID }), nodeID)) === 1;

    if (!lockAcquired) {
      throw new Error('migration lock exists already');
    }

    await this.cacheService.redis
      .pipeline()

      .expire(MigrationService.getMigrationLockKey({ versionID }), MIGRATION_LOCK_EXPIRY_TIMEOUT)

      .unlink(MigrationService.getActiveSchemaVersionKey({ versionID }))

      .exec();
  }

  public async resetMigrationLock(versionID: string): Promise<void> {
    await this.cacheService.redis.unlink(MigrationService.getMigrationLockKey({ versionID }));
  }

  public async setActiveSchemaVersion(versionID: string, targetSchemaVersion: Realtime.SchemaVersion): Promise<void> {
    await this.cacheService.redis
      .pipeline()

      .set(MigrationService.getActiveSchemaVersionKey({ versionID }), targetSchemaVersion)
      .expire(MigrationService.getActiveSchemaVersionKey({ versionID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .unlink(MigrationService.getMigrationLockKey({ versionID }))

      .exec();
  }

  public async getActiveSchemaVersion(versionID: string): Promise<Nullable<Realtime.SchemaVersion>> {
    const schemaVersion = await this.cacheService.redis.get(MigrationService.getActiveSchemaVersionKey({ versionID }));

    if (!schemaVersion) return null;

    return Number(schemaVersion) as Realtime.SchemaVersion;
  }

  public async isMigrationLocked(versionID: string): Promise<boolean> {
    return !!(await this.cacheService.redis.get(MigrationService.getMigrationLockKey({ versionID })));
  }

  public async renewActiveSchemaVersion(versionID: string): Promise<void> {
    await this.cacheService.redis.expire(MigrationService.getActiveSchemaVersionKey({ versionID }), HEARTBEAT_EXPIRE_TIMEOUT);
  }

  /**
   * this is the best place to implement any feature-aware logic to allow or block a pending migration
   */
  public async getTargetSchemaVersion(versionID: string, proposedVersion: Realtime.SchemaVersion): Promise<Realtime.SchemaVersion> {
    const activeSchemaVersion = await this.getActiveSchemaVersion(versionID);
    if (activeSchemaVersion) return activeSchemaVersion;

    const targetVersions = Realtime.SUPPORTED_SCHEMA_VERSIONS.filter((version) => version <= proposedVersion);

    return targetVersions[targetVersions.length - 1];
  }

  public async *migrateSchema(
    creatorID: number,
    projectID: string,
    clientNodeID: string,
    version: BaseVersion.Version,
    targetSchemaVersion: Realtime.SchemaVersion
  ): AsyncIterable<MigrationState> {
    const versionID = version._id;
    const isMigrationLocked = await this.isMigrationLocked(versionID);
    if (isMigrationLocked) {
      // cannot perform a migration because one is already in progress
      yield MigrationState.NOT_ALLOWED;
      return;
    }

    const activeSchemaVersion = await this.getActiveSchemaVersion(versionID);

    // handle the case where a schema version is being actively used
    if (activeSchemaVersion) {
      if (targetSchemaVersion >= activeSchemaVersion) {
        yield MigrationState.NOT_REQUIRED;
      } else {
        yield MigrationState.NOT_SUPPORTED;
      }

      return;
    }

    const currentSchemaVersion = version._version ?? Realtime.SchemaVersion.V1;
    const pendingMigrations = Realtime.Migrate.getPendingMigrations(currentSchemaVersion, targetSchemaVersion);

    // no pending migrations
    if (!pendingMigrations.length) {
      await this.setActiveSchemaVersion(versionID, currentSchemaVersion);

      yield MigrationState.NOT_REQUIRED;
      return;
    }

    try {
      await this.acquireMigrationLock(versionID, clientNodeID);
    } catch (err) {
      // this.log.debug(err);

      // could not acquire lock because a migration is already in progress
      yield MigrationState.NOT_ALLOWED;
      return;
    }

    yield MigrationState.STARTED;

    try {
      const [project, diagrams] = await Promise.all([this.projectService.get(creatorID, projectID), this.services.diagram.getAll(versionID)]);

      const migrationResult = Realtime.Migrate.migrateProject(
        {
          version,
          project,
          diagrams,
        },
        targetSchemaVersion
      );

      await this.services.version.replaceResources(
        versionID,
        { ...migrationResult.version, _version: targetSchemaVersion },
        migrationResult.diagrams.map(({ _id, ...data }) => [_id, data])
      );

      await this.setActiveSchemaVersion(versionID, targetSchemaVersion);

      yield MigrationState.DONE;
    } catch (err) {
      await this.resetMigrationLock(versionID);
      throw err;
    }
  }
}
