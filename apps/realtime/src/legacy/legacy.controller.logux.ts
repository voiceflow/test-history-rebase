import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Context, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

// import { UserID } from '@voiceflow/sdk-auth/nestjs';
import { MigrationService } from './migration.service';

@Controller()
export class LegacyLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES)) private readonly orm: MikroORM,
    @Inject(MigrationService) private readonly migrationService: MigrationService
  ) {}

  @Action(Realtime.version.schema.negotiate.started)
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
