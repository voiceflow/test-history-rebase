import { Controller, Inject } from '@nestjs/common';
import { Action, Context, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

import { InjectRequestContext, UseRequestContext } from '@/common';

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
    @Payload() { versionID, proposedSchemaVersion }: { versionID: string; proposedSchemaVersion: Realtime.SchemaVersion },
    @Context() ctx: Context.Action
  ) {
    return this.schemaService.negotiate({
      payload: { creatorID: Number(ctx.userId), versionID, proposedSchemaVersion },
      ctx,
    });
  }
}
