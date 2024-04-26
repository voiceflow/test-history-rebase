import { Inject, Injectable } from '@nestjs/common';
import { AuthMetaPayload, Context, LoguxService } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { AsyncRejectionError } from '@voiceflow/socket-utils';

import { LegacyService } from '@/legacy/legacy.service';
import { ProjectLegacyService } from '@/project/project-legacy/project-legacy.service';
import { AsyncActionError } from '@/utils/logux.util';

import { MigrationState } from '../migration.enum';
import { MigrationService } from '../migration.service';
import {
  INTERNAL_ERROR_MESSAGE,
  MIGRATION_IN_PROGRESS_MESSAGE,
  SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE,
} from './schema.constants';

@Injectable()
export class SchemaService {
  constructor(
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(LegacyService)
    private readonly legacy: LegacyService,
    @Inject(ProjectLegacyService)
    private readonly projectLegacy: ProjectLegacyService,
    @Inject(MigrationService)
    private readonly migration: MigrationService
  ) {}

  public async negotiate({
    payload,
    ctx,
    authMeta,
  }: {
    payload: { creatorID: number; versionID: string; proposedSchemaVersion: Realtime.SchemaVersion };
    ctx: Context.Action;
    authMeta: AuthMetaPayload;
  }) {
    const { creatorID, versionID, proposedSchemaVersion } = payload;

    const [targetSchemaVersion, version] = await Promise.all([
      this.migration.getTargetSchemaVersion(versionID, proposedSchemaVersion),
      this.legacy.models.version.findByID(versionID).then(this.legacy.models.version.adapter.fromDB),
    ]);
    const { teamID: workspaceID } = await this.projectLegacy.get(creatorID, version.projectID);

    const currentSchemaVersion = (version._version ?? Realtime.SchemaVersion.V1) as Realtime.SchemaVersion;
    const skipResult = { workspaceID, projectID: version.projectID, schemaVersion: currentSchemaVersion };

    if (targetSchemaVersion > proposedSchemaVersion) {
      throw new AsyncActionError({
        message: SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE,
        code: Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED,
      });
    }

    const migrateResult = { ...skipResult, schemaVersion: targetSchemaVersion };

    const migrator = this.migration.migrateSchema({
      creatorID,
      clientNodeID: ctx.clientId,
      version,
      targetSchemaVersion,
    });

    try {
      const result = await this.applySchemaMigrations(ctx, { versionID, migrateResult, skipResult, migrator });

      if (!result) {
        throw new Error(INTERNAL_ERROR_MESSAGE);
      }

      await this.logux.processAs(Realtime.version.schema.migrate.done({ params: { versionID }, result }), authMeta);

      return result;
    } catch (err) {
      if (!(err instanceof AsyncRejectionError)) {
        // warn other waiting clients to reload and attempt migration
        await this.logux.processAs(
          Realtime.version.schema.migrate.failed({ params: { versionID }, error: { message: INTERNAL_ERROR_MESSAGE } }),
          authMeta
        );
      }

      throw err;
    }
  }

  private async applySchemaMigrations(
    ctx: Context.Action,
    {
      migrator,
      versionID,
      skipResult,
      migrateResult,
    }: {
      migrator: AsyncIterable<MigrationState>;
      versionID: string;
      skipResult: Realtime.version.schema.NegotiateResultPayload;
      migrateResult: Realtime.version.schema.NegotiateResultPayload;
    }
  ): Promise<Realtime.version.schema.NegotiateResultPayload | null> {
    for await (const state of migrator) {
      switch (state) {
        case MigrationState.NOT_REQUIRED:
          return skipResult;

        case MigrationState.NOT_ALLOWED:
          throw new AsyncActionError({
            message: MIGRATION_IN_PROGRESS_MESSAGE,
            code: Realtime.ErrorCode.MIGRATION_IN_PROGRESS,
          });

        case MigrationState.NOT_SUPPORTED:
          throw new AsyncActionError({
            message: SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE,
            code: Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED,
          });

        case MigrationState.STARTED:
          await ctx.sendBack(Realtime.version.schema.migrate.started({ versionID }));
          continue;

        case MigrationState.DONE:
          return migrateResult;

        default:
          continue;
      }
    }

    return null;
  }
}
