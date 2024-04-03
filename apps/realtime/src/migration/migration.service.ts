/* eslint-disable max-params */
import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Logger } from '@nestjs/common';
import { BaseVersion } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AssistantSerializer } from '@/assistant/assistant.serializer';
import { AssistantService } from '@/assistant/assistant.service';
import { EnvironmentService } from '@/environment/environment.service';
import { LegacyService } from '@/legacy/legacy.service';
import { ProjectLegacyService } from '@/project/project-legacy/project-legacy.service';

import { MigrationCacheService } from './cache/cache.service';
import { MigrationState } from './migration.enum';
import { getUpdatedDiagrams } from './migration.util';

export class MigrationService {
  private readonly logger: Logger = new Logger(MigrationService.name);

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(LegacyService)
    private readonly legacy: LegacyService,
    @Inject(AssistantService)
    private readonly assistant: AssistantService,
    @Inject(EnvironmentService)
    private readonly environment: EnvironmentService,
    @Inject(ProjectLegacyService)
    private readonly projectLegacy: ProjectLegacyService,
    @Inject(MigrationCacheService)
    private readonly migrationCache: MigrationCacheService,
    @Inject(AssistantSerializer)
    private readonly assistantSerializer: AssistantSerializer
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
    version,
    creatorID,
    clientNodeID,
    targetSchemaVersion,
  }: {
    version: BaseVersion.Version;
    creatorID: number;
    clientNodeID: string;
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

    const currentSchemaVersion = (version._version ?? Realtime.SchemaVersion.V1) as Realtime.SchemaVersion;
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
      this.logger.debug(err);

      // could not acquire lock because a migration is already in progress
      yield MigrationState.NOT_ALLOWED;
      return;
    }

    yield MigrationState.STARTED;

    try {
      const [result, patches] = await this.postgresEM.transactional(async () => {
        const [project, diagrams, assistant, cmsData] = await Promise.all([
          this.projectLegacy.get(creatorID, projectID),
          this.legacy.models.diagram.findManyByVersionID(versionID).then(this.legacy.models.diagram.adapter.mapFromDB),
          this.assistant.findOne(projectID),
          this.environment.findOneCMSDataToMigrate(versionID),
        ]);

        const [result, patches] = Realtime.Migrate.migrateProject(
          {
            version,
            project,
            diagrams,
            creatorID,
            cms: {
              ...this.environment.toJSONCMSData({
                ...cmsData,
                flows: [],
                folders: [],
                intents: [],
                entities: [],
                functions: [],
                workflows: [],
                responses: [],
                utterances: [],
                attachments: [],
                cardButtons: [],
                functionPaths: [],
                entityVariants: [],
                requiredEntities: [],
                responseVariants: [],
                functionVariables: [],
                responseAttachments: [],
                responseDiscriminators: [],
              }),

              assistant: this.assistantSerializer.nullable(assistant),
            },
          },
          targetSchemaVersion
        );

        await this.assistant.migrateOne(result, patches);
        await this.environment.migrateCMSData(result, patches, { userID: creatorID, assistantID: version.projectID, environmentID: version._id });

        return [result, patches];
      });

      const updatedDiagrams = getUpdatedDiagrams(result, patches);

      // update only changed diagrams
      if (updatedDiagrams.length) {
        await Promise.all(
          updatedDiagrams.map(({ diagramID, ...data }) =>
            this.legacy.models.diagram.updateOne(
              this.legacy.models.diagram.adapter.toDB({ versionID, diagramID }),
              this.legacy.models.diagram.adapter.toDB(Utils.object.omit(data, ['_id']))
            )
          )
        );
      }

      // update version if it was changed
      if (patches.some(({ path }) => path[0] === 'version')) {
        await this.legacy.models.version.updateByID(
          versionID,
          this.legacy.models.version.adapter.toDB({ ...result.version, _version: targetSchemaVersion })
        );
      }

      await this.migrationCache.setActiveSchemaVersion(versionID, targetSchemaVersion);

      yield MigrationState.DONE;
    } catch (err) {
      this.logger.error(err);

      await this.migrationCache.resetMigrationLock(versionID);

      throw err;
    }
  }
}
