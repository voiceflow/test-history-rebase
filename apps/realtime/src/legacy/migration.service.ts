/* eslint-disable no-secrets/no-secrets */
import { Inject, Injectable } from '@nestjs/common';
import { Context, LoguxService } from '@voiceflow/nestjs-logux';

// import * as Realtime from '@voiceflow/realtime-sdk/backend';
// import { AsyncRejectionError } from '@voiceflow/socket-utils';

// import { INTERNAL_ERROR_MESSAGE } from './actions/version/schema/negotiate';
// import { LegacyService } from './legacy.service';
// import { MigrationState } from './services/migrate/constants';

@Injectable()
export class MigrationService {
  constructor(@Inject(LoguxService) private readonly loguxService: LoguxService) {}

  public async migrate({ payload, ctx }: { payload: { creatorID: number; versionID: string; proposedSchemaVersion: number }; ctx: Context.Action }) {
    // eslint-disable-next-line no-console
    console.log(this.loguxService, { payload, ctx });
    return null;
  }
  //   const { creatorID, versionID, proposedSchemaVersion } = payload;

  //   const [targetSchemaVersion, { projectID, _version: currentSchemaVersion = Realtime.SchemaVersion.V1 }] = await Promise.all([
  //     this.manager.services.migrate.getTargetSchemaVersion(versionID, proposedSchemaVersion),
  //     this.manager.services.version.get(versionID),
  //   ]);
  //   const { teamID: workspaceID } = await this.manager.services.project.get(creatorID, projectID);

  //   const skipResult = { workspaceID, projectID, schemaVersion: currentSchemaVersion };

  //   if (targetSchemaVersion > proposedSchemaVersion) {
  //     // this.reject(SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE, Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED);
  //     return null;
  //   }

  //   const migrateResult = { ...skipResult, schemaVersion: targetSchemaVersion };

  //   const migrator = this.manager.services.migrate.migrateSchema(creatorID, projectID, versionID, ctx.clientId, targetSchemaVersion);

  //   try {
  //     const result = await this.applySchemaMigrations(ctx, { versionID, migrateResult, skipResult, migrator });

  //     if (!result) {
  //       // this.reject(INTERNAL_ERROR_MESSAGE);
  //       return null;
  //     }

  //     await this.logux.process(Realtime.version.schema.migrate.done({ params: { versionID }, result }));

  //     return result;
  //   } catch (err) {
  //     if (!(err instanceof AsyncRejectionError)) {
  //       // warn other waiting clients to reload and attempt migration
  //       await this.logux.process(Realtime.version.schema.migrate.failed({ params: { versionID }, error: { message: INTERNAL_ERROR_MESSAGE } }));
  //     }

  //     throw err;
  //   }
  // }

  // private async applySchemaMigrations(
  //   ctx: Context.Action,
  //   {
  //     versionID,
  //     migrateResult,
  //     skipResult,
  //     migrator,
  //   }: {
  //     versionID: string;
  //     migrateResult: Realtime.version.schema.NegotiateResultPayload;
  //     skipResult: Realtime.version.schema.NegotiateResultPayload;
  //     migrator: AsyncIterable<MigrationState>;
  //   }
  // ): Promise<Realtime.version.schema.NegotiateResultPayload | null> {
  //   // eslint-disable-next-line no-restricted-syntax
  //   for await (const state of migrator) {
  //     switch (state) {
  //       case MigrationState.NOT_REQUIRED:
  //         return skipResult;

  //       case MigrationState.NOT_ALLOWED:
  //         // this.reject(MIGRATION_IN_PROGRESS_MESSAGE, Realtime.ErrorCode.MIGRATION_IN_PROGRESS);
  //         return null;

  //       case MigrationState.NOT_SUPPORTED:
  //         // this.reject(SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE, Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED);
  //         return null;

  //       case MigrationState.STARTED:
  //         await ctx.sendBack(Realtime.version.schema.migrate.started({ versionID }));
  //         continue;

  //       case MigrationState.DONE:
  //         return migrateResult;

  //       default:
  //         continue;
  //     }
  //   }

  //   return null;
  // }
}
