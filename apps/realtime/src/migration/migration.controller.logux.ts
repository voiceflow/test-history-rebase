import { Controller, Inject } from '@nestjs/common';
import type { AuthMetaPayload } from '@voiceflow/nestjs-logux';
import { Action, AuthMeta, Broadcast, Context, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import type { Failure, Success } from 'typescript-fsa';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { SchemaService } from './schema/schema.service';

@Controller()
@InjectRequestContext()
export class MigrationLoguxController {
  constructor(
    @Inject(SchemaService)
    private readonly schemaService: SchemaService
  ) {}

  @Authorize.Permissions<Realtime.version.schema.NegotiatePayload>([Permission.PROJECT_READ], ({ versionID }) => [
    {
      id: versionID,
      kind: 'version',
    },
  ])
  @Action.Async(Realtime.version.schema.negotiate)
  @UseRequestContext()
  public async negotiateSchema(
    @Payload()
    { versionID, proposedSchemaVersion }: { versionID: string; proposedSchemaVersion: Realtime.SchemaVersion },
    @Context() ctx: Context.Action,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    return this.schemaService.negotiate({
      payload: { creatorID: Number(ctx.userId), versionID, proposedSchemaVersion },
      ctx,
      authMeta,
    });
  }

  @Action(Realtime.version.schema.migrate.started)
  @Authorize.Permissions<Realtime.version.schema.MigratePayload>([Permission.PROJECT_UPDATE], (request) => ({
    id: request.versionID,
    kind: 'version',
  }))
  @Broadcast<Realtime.version.schema.MigratePayload>(({ versionID }) => ({
    channel: Realtime.Channels.schema.build({ versionID }),
  }))
  @BroadcastOnly()
  async migrateSchemaStarted(@Payload() _: any) {
    // broadcast only
  }

  @Action(Realtime.version.schema.migrate.done)
  @Authorize.Permissions<
    Success<Realtime.version.schema.MigratePayload, Realtime.version.schema.NegotiateResultPayload>
  >([Permission.PROJECT_UPDATE], (request) => ({
    id: request.params.versionID,
    kind: 'version',
  }))
  @Broadcast<Success<Realtime.version.schema.MigratePayload, Realtime.version.schema.NegotiateResultPayload>>(
    ({ params }) => ({
      channel: Realtime.Channels.schema.build({ versionID: params.versionID }),
    })
  )
  @BroadcastOnly()
  async migrateSchemaDone(@Payload() _: any) {
    // broadcast only
  }

  @Action(Realtime.version.schema.migrate.failed)
  @Authorize.Permissions<Failure<Realtime.version.schema.MigratePayload, Realtime.RealtimeError>>(
    [Permission.PROJECT_UPDATE],
    (request) => ({
      id: request.params.versionID,
      kind: 'version',
    })
  )
  @Broadcast<Failure<Realtime.version.schema.MigratePayload, Realtime.RealtimeError>>(({ params }) => ({
    channel: Realtime.Channels.schema.build({ versionID: params.versionID }),
  }))
  @BroadcastOnly()
  async migrateSchemaFailed(@Payload() _: any) {
    // broadcast only
  }
}
