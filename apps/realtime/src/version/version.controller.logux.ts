// import { UseRequestContext } from '@mikro-orm/core';
import { Controller, Inject } from '@nestjs/common';
import { Action, Context, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { VersionService } from './version.service';

@Controller()
export class VersionsLoguxController {
  constructor(@Inject(VersionService) private readonly versionService: VersionService) {}

  @Action.Async(Realtime.version.schema.negotiate)
  // @UseRequestContext()
  public async negotiateSchema(
    @Payload() { versionID, proposedSchemaVersion }: { versionID: string; proposedSchemaVersion: number },
    @Context() ctx: Context.Action
  ) {
    return this.versionService.negotiateSchema({
      payload: { creatorID: Number(ctx.userId), versionID, proposedSchemaVersion },
      ctx,
    });
  }
}
