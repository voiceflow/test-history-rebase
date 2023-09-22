// eslint-disable-next-line import/no-extraneous-dependencies
import { UseRequestContext } from '@mikro-orm/core';
import { Controller, Inject } from '@nestjs/common';
import { Action, Context, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { UserID } from '@voiceflow/sdk-auth/nestjs';

import { MigrationService } from './migration.service';

@Controller()
export class LegacyLoguxController {
  constructor(@Inject(MigrationService) private readonly migrationService: MigrationService) {}

  @UseRequestContext()
  @Action(Realtime.version.schema.negotiate.started)
  public async negotiate(@UserID() userID: number, @Payload() { versionID, proposedSchemaVersion }: any, @Context() ctx: Context.Action) {
    // eslint-disable-next-line no-console
    console.log('NEGOTIATE NEW ACTION');
    return this.migrationService.migrate({ payload: { creatorID: userID, versionID, proposedSchemaVersion }, ctx });
  }
}
