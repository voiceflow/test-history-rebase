import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { AsyncRejectionError, Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractActionControl } from '@/actions/utils';
import logger from '@/logger';
import { MigrationState } from '@/services/migrate/constants';

export const MIGRATION_IN_PROGRESS_MESSAGE = 'a migration is already in progress';
export const SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE = 'target schema version not supported';
export const INTERNAL_ERROR_MESSAGE = 'migration system experienced an internal error';

class NegotiateSchema extends AbstractActionControl<Realtime.version.schema.NegotiatePayload> {
  protected actionCreator = Realtime.version.schema.negotiate.started;

  access = (ctx: Context, action: Action<Realtime.version.schema.NegotiatePayload>): Promise<boolean> =>
    this.services.version.access.canRead(ctx.data.creatorID, action.payload.versionID);

  protected resend = terminateResend;

  process = this.reply(Realtime.version.schema.negotiate, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const { versionID, proposedSchemaVersion } = payload;

    const [targetSchemaVersion, { projectID, _version: currentSchemaVersion = Realtime.SchemaVersion.V1 }] = await Promise.all([
      this.services.migrate.getTargetSchemaVersion(versionID, proposedSchemaVersion),
      this.services.version.get(versionID),
    ]);
    const { teamID: workspaceID } = await this.services.project.get(creatorID, projectID);

    const skipResult = { workspaceID, projectID, schemaVersion: currentSchemaVersion };

    if (targetSchemaVersion > proposedSchemaVersion) {
      this.reject(SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE, Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED);
    }

    const migrateResult = { ...skipResult, schemaVersion: targetSchemaVersion };

    const migrator = this.services.migrate.migrateSchema(creatorID, projectID, versionID, ctx.clientId, targetSchemaVersion);

    try {
      const result = await this.applySchemaMigrations(ctx, { versionID, migrateResult, skipResult, migrator });

      if (!result) {
        this.reject(INTERNAL_ERROR_MESSAGE);
      }

      await this.server.process(Realtime.version.schema.migrate.done({ params: { versionID }, result }));

      return result;
    } catch (err) {
      logger.error(err);

      if (!(err instanceof AsyncRejectionError)) {
        // warn other waiting clients to reload and attempt migration
        await this.server.process(Realtime.version.schema.migrate.failed({ params: { versionID }, error: { message: INTERNAL_ERROR_MESSAGE } }));
      }

      throw err;
    }
  });

  private async applySchemaMigrations(
    ctx: Context,
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
          this.reject(MIGRATION_IN_PROGRESS_MESSAGE, Realtime.ErrorCode.MIGRATION_IN_PROGRESS);
          return null;

        case MigrationState.NOT_SUPPORTED:
          this.reject(SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE, Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED);
          return null;

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

export default NegotiateSchema;
