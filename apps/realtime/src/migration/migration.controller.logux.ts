import { UseRequestContext } from '@mikro-orm/core';
import { Controller, Inject } from '@nestjs/common';
import { Action, Context, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { SchemaService } from './schema.service';

@Controller()
export class MigrationLoguxController {
  constructor(@Inject(SchemaService) private readonly schemaService: SchemaService) {}

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
