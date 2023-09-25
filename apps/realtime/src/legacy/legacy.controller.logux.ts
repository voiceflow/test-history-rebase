import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Context, Effect, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { MigrationService } from './migration.service';

@Controller()
export class LegacyLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES)) private readonly orm: MikroORM,
    @Inject(MigrationService) private readonly migrationService: MigrationService
  ) {}

  @Action.Async(Realtime.version.schema.negotiate)
  @UseRequestContext()
  public async negotiate(
    @Payload() { versionID, proposedSchemaVersion }: { versionID: string; proposedSchemaVersion: number },
    @Context() ctx: Context.Action
  ) {
    return this.migrationService.migrate({
      payload: { creatorID: Number(ctx.userId), versionID, proposedSchemaVersion },
      ctx,
    });
  }
}
