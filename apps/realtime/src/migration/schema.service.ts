import { Inject, Injectable } from '@nestjs/common';
import { Context, LoguxService } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { AsyncRejectionError } from '@voiceflow/socket-utils';

import { ProjectService } from '@/project/project.service';
import { AsyncActionError } from '@/utils/logux';
import { VersionService } from '@/version/version.service';

import { MigrationState } from './migration.enum';
import { MigrationService } from './migration.service';

export const MIGRATION_IN_PROGRESS_MESSAGE = 'a migration is already in progress';
export const SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE = 'target schema version not supported';
export const INTERNAL_ERROR_MESSAGE = 'migration system experienced an internal error';

@Injectable()
export class SchemaService {
  constructor(
    @Inject(ProjectService) private projectService: ProjectService,
    @Inject(MigrationService) private migrationService: MigrationService,
    @Inject(LoguxService) private logux: LoguxService,
    @Inject(VersionService) private versionService: VersionService
  ) {}

  public async negotiate({
    payload,
    ctx,
  }: {
    payload: { creatorID: number; versionID: string; proposedSchemaVersion: number };
    ctx: Context.Action;
  }) {
    const { creatorID, versionID, proposedSchemaVersion } = payload;

    const [targetSchemaVersion, version] = await Promise.all([
      this.migrationService.getTargetSchemaVersion(versionID, proposedSchemaVersion),
      this.versionService.get(versionID),
    ]);
    const { teamID: workspaceID } = await this.projectService.get(creatorID, version.projectID);

    const currentSchemaVersion = version._version ?? Realtime.SchemaVersion.V1;
    const skipResult = { workspaceID, projectID: version.projectID, schemaVersion: currentSchemaVersion };

    if (targetSchemaVersion > proposedSchemaVersion) {
      throw new AsyncActionError({ message: SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE, code: Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED });
    }

    const migrateResult = { ...skipResult, schemaVersion: targetSchemaVersion };

    const migrator = this.migrationService.migrateSchema({ creatorID, clientNodeID: ctx.clientId, version, targetSchemaVersion });

    try {
      const result = await this.applySchemaMigrations(ctx, { versionID, migrateResult, skipResult, migrator });

      if (!result) {
        throw new Error(INTERNAL_ERROR_MESSAGE);
      }

      await this.logux.process(Realtime.version.schema.migrate.done({ params: { versionID }, result }));

      return result;
    } catch (err) {
      if (!(err instanceof AsyncRejectionError)) {
        // warn other waiting clients to reload and attempt migration
        await this.logux.process(Realtime.version.schema.migrate.failed({ params: { versionID }, error: { message: INTERNAL_ERROR_MESSAGE } }));
      }

      throw err;
    }
  }

  private async applySchemaMigrations(
    ctx: Context.Action,
    {
      versionID,
      migrateResult,
      skipResult,
      migrator,
    }: {
      versionID: string;
      migrateResult: Realtime.version.schema.NegotiateResultPayload;
      skipResult: Realtime.version.schema.NegotiateResultPayload;
      migrator: AsyncIterable<MigrationState>;
    }
  ): Promise<Realtime.version.schema.NegotiateResultPayload | null> {
    // eslint-disable-next-line no-restricted-syntax
    for await (const state of migrator) {
      switch (state) {
        case MigrationState.NOT_REQUIRED:
          return skipResult;

        case MigrationState.NOT_ALLOWED:
          throw new AsyncActionError({ message: MIGRATION_IN_PROGRESS_MESSAGE, code: Realtime.ErrorCode.MIGRATION_IN_PROGRESS });

        case MigrationState.NOT_SUPPORTED:
          throw new AsyncActionError({ message: SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE, code: Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED });

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
