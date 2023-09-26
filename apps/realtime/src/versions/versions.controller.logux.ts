import { UseRequestContext } from '@mikro-orm/core';
import { Controller, Inject } from '@nestjs/common';
import { Action, Context, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { VersionsService } from './versions.service';

@Controller()
export class VersionsLoguxController {
  constructor(@Inject(VersionsService) private readonly versionsService: VersionsService) {}

  @Action.Async(Realtime.version.schema.negotiate)
  @UseRequestContext()
  public async negotiateSchema(
    @Payload() { versionID, proposedSchemaVersion }: { versionID: string; proposedSchemaVersion: number },
    @Context() ctx: Context.Action
  ) {
    return this.versionsService.negotiateSchema({
      payload: { creatorID: Number(ctx.userId), versionID, proposedSchemaVersion },
      ctx,
    });
  }
}
