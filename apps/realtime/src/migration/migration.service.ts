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
import { EntitySerializer } from '@/common';
import { EnvironmentService } from '@/environment/environment.service';
import { LegacyService } from '@/legacy/legacy.service';
import { ProjectLegacyService } from '@/project/project-legacy/project-legacy.service';

import { MigrationCacheService } from './cache/cache.service';
import { MigrationState } from './migration.enum';

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
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer,
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
      await this.postgresEM.transactional(async () => {
        const [project, diagrams, assistant, cmsData] = await Promise.all([
          this.projectLegacy.get(creatorID, projectID),
          this.legacy.models.diagram.findManyByVersionID(versionID).then(this.legacy.models.diagram.adapter.mapFromDB),
          this.assistant.findOne(projectID),
          this.environment.findOneCMSData(projectID, versionID),
        ]);

        const migrationResult = Realtime.Migrate.migrateProject(
          {
            version,
            project,
            diagrams,
            creatorID,
            cms: {
              intents: this.entitySerializer.iterable(cmsData.intents),
              entities: this.entitySerializer.iterable(cmsData.entities),
              assistant: this.assistantSerializer.nullable(assistant),
              responses: this.entitySerializer.iterable(cmsData.responses),
              utterances: this.entitySerializer.iterable(cmsData.utterances),
              entityVariants: this.entitySerializer.iterable(cmsData.entityVariants),
              requiredEntities: this.entitySerializer.iterable(cmsData.requiredEntities),
              responseVariants: this.entitySerializer.iterable(cmsData.responseVariants),
              responseDiscriminators: this.entitySerializer.iterable(cmsData.responseDiscriminators),
            },
          },
          targetSchemaVersion
        );

        // upsert CMS data first to don't create diagrams/version if CMS data is invalid

        if (migrationResult.cms.assistant) {
          await this.assistant.upsertOne({
            ...migrationResult.cms.assistant,
            workspaceID: this.assistantSerializer.decodeWorkspaceID(migrationResult.cms.assistant.workspaceID),
          });
        }

        await this.environment.upsertCMSData({
          intents: migrationResult.cms.intents,
          prompts: [],
          stories: [],
          triggers: [],
          entities: migrationResult.cms.entities,
          functions: [],
          responses: migrationResult.cms.responses,
          utterances: migrationResult.cms.utterances,
          cardButtons: [],
          attachments: [],
          functionPaths: [],
          entityVariants: migrationResult.cms.entityVariants,
          requiredEntities: migrationResult.cms.requiredEntities,
          responseVariants: migrationResult.cms.responseVariants,
          functionVariables: [],
          responseAttachments: [],
          responseDiscriminators: migrationResult.cms.responseDiscriminators,
        });

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
      });

      yield MigrationState.DONE;
    } catch (err) {
      this.logger.error(err);

      await this.migrationCache.resetMigrationLock(versionID);

      throw err;
    }
  }
}
