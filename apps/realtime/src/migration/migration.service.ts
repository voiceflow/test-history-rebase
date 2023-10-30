import { Inject } from '@nestjs/common';
import { BaseVersion } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Logger } from 'nestjs-pino';

import { LegacyService } from '@/legacy/legacy.service';
import { ProjectService } from '@/project/project.service';

import { MigrationCacheService } from './cache/cache.service';
import { MigrationState } from './migration.enum';

export class MigrationService {
  constructor(
    @Inject(Logger)
    private readonly log: Logger,
    @Inject(LegacyService)
    private readonly legacy: LegacyService,
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(MigrationCacheService)
    private readonly migrationCache: MigrationCacheService
  ) {}

  /**
   * this is the best place to implement any feature-aware logic to allow or block a pending migration
   */
  public async getTargetSchemaVersion(versionID: string, proposedVersion: Realtime.SchemaVersion): Promise<Realtime.SchemaVersion> {
    const activeSchemaVersion = await this.migrationCache.getActiveSchemaVersion(versionID);
    if (activeSchemaVersion) return activeSchemaVersion;

    const targetVersions = Realtime.SUPPORTED_SCHEMA_VERSIONS.filter((version) => version <= proposedVersion);

    return targetVersions[targetVersions.length - 1];
  }

  public async *migrateSchema({
    creatorID,
    clientNodeID,
    version,
    targetSchemaVersion,
  }: {
    creatorID: number;
    clientNodeID: string;
    version: BaseVersion.Version;
    targetSchemaVersion: Realtime.SchemaVersion;
  }): AsyncIterable<MigrationState> {
    const { projectID, _id: versionID } = version;

    const isMigrationLocked = await this.migrationCache.isMigrationLocked(versionID);
    if (isMigrationLocked) {
      // cannot perform a migration because one is already in progress
      yield MigrationState.NOT_ALLOWED;
      return;
    }

    const activeSchemaVersion = await this.migrationCache.getActiveSchemaVersion(versionID);

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
      await this.migrationCache.setActiveSchemaVersion(versionID, currentSchemaVersion);

      yield MigrationState.NOT_REQUIRED;
      return;
    }

    try {
      await this.migrationCache.acquireMigrationLock(versionID, clientNodeID);
    } catch (err) {
      this.log.debug(err);

      // could not acquire lock because a migration is already in progress
      yield MigrationState.NOT_ALLOWED;
      return;
    }

    yield MigrationState.STARTED;

    try {
      const [project, diagrams] = await Promise.all([
        this.project.getLegacy(creatorID, projectID),
        this.legacy.models.diagram.findManyByVersionID(versionID).then(this.legacy.models.diagram.adapter.mapFromDB),
      ]);

      const migrationResult = Realtime.Migrate.migrateProject(
        {
          version,
          project,
          diagrams,
        },
        targetSchemaVersion
      );

      await Promise.all(
        migrationResult.diagrams.map(({ diagramID, ...data }) =>
          this.legacy.models.diagram.updateOne(
            this.legacy.models.diagram.adapter.toDB({ versionID, diagramID }),
            this.legacy.models.diagram.adapter.toDB(Utils.object.omit(data, ['_id']))
          )
        )
      );

      await this.legacy.models.version.updateByID(
        versionID,
        this.legacy.models.version.adapter.toDB({ ...migrationResult.version, _version: targetSchemaVersion })
      );

      await this.migrationCache.setActiveSchemaVersion(versionID, targetSchemaVersion);

      yield MigrationState.DONE;
    } catch (err) {
      await this.migrationCache.resetMigrationLock(versionID);
      throw err;
    }
  }
}
