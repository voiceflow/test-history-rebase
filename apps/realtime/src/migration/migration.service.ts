import { Inject } from '@nestjs/common';
import { BaseVersion } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Logger } from 'nestjs-pino';

import { DiagramService } from '@/diagram/diagram.service';
import { ProjectService } from '@/project/project.service';
import { VersionService } from '@/version/version.service';

import { MigrationCacheService } from './cache/cache.service';
import { MigrationState } from './migration.enum';

export class MigrationService {
  constructor(
    @Inject(MigrationCacheService) private readonly migrationCacheService: MigrationCacheService,
    @Inject(ProjectService) private readonly projectService: ProjectService,
    @Inject(DiagramService) private readonly diagramService: DiagramService,
    @Inject(VersionService) private readonly versionService: VersionService,
    @Inject(Logger) private readonly log: Logger
  ) {}

  /**
   * this is the best place to implement any feature-aware logic to allow or block a pending migration
   */
  public async getTargetSchemaVersion(versionID: string, proposedVersion: Realtime.SchemaVersion): Promise<Realtime.SchemaVersion> {
    const activeSchemaVersion = await this.migrationCacheService.getActiveSchemaVersion(versionID);
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

    const isMigrationLocked = await this.migrationCacheService.isMigrationLocked(versionID);
    if (isMigrationLocked) {
      // cannot perform a migration because one is already in progress
      yield MigrationState.NOT_ALLOWED;
      return;
    }

    const activeSchemaVersion = await this.migrationCacheService.getActiveSchemaVersion(versionID);

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
      await this.migrationCacheService.setActiveSchemaVersion(versionID, currentSchemaVersion);

      yield MigrationState.NOT_REQUIRED;
      return;
    }

    try {
      await this.migrationCacheService.acquireMigrationLock(versionID, clientNodeID);
    } catch (err) {
      this.log.debug(err);

      // could not acquire lock because a migration is already in progress
      yield MigrationState.NOT_ALLOWED;
      return;
    }

    yield MigrationState.STARTED;

    try {
      const [project, diagrams] = await Promise.all([this.projectService.get(creatorID, projectID), this.diagramService.getAll(versionID)]);

      const migrationResult = Realtime.Migrate.migrateProject(
        {
          version,
          project,
          diagrams,
        },
        targetSchemaVersion
      );

      await this.versionService.replaceResources(
        versionID,
        { ...migrationResult.version, _version: targetSchemaVersion },
        migrationResult.diagrams.map(({ _id, diagramID, ...data }) => [diagramID ?? _id, data])
      );

      await this.migrationCacheService.setActiveSchemaVersion(versionID, targetSchemaVersion);

      yield MigrationState.DONE;
    } catch (err) {
      await this.migrationCacheService.resetMigrationLock(versionID);
      throw err;
    }
  }
}
