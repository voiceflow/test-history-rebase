import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Context, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

import { SchemaService } from './schema/schema.service';

@Controller()
export class MigrationLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    readonly orm: MikroORM,
    @Inject(SchemaService) private readonly schemaService: SchemaService
  ) {}

  @Authorize.Permissions<Realtime.version.schema.NegotiatePayload>([Permission.VERSION_PLATFORM_DATA_UPDATE], ({ versionID }) => [
    {
      id: versionID,
      kind: 'version',
    },
  ])
  @Action.Async(Realtime.version.schema.negotiate)
  @UseRequestContext()
  public async negotiateSchema(
    @Payload() { versionID, proposedSchemaVersion }: { versionID: string; proposedSchemaVersion: number },
    @Context() ctx: Context.Action
  ) {
    return this.schemaService.negotiate({
      payload: { creatorID: Number(ctx.userId), versionID, proposedSchemaVersion },
      ctx,
    });
  }
}
