// import { UseRequestContext } from '@mikro-orm/core';
import { Controller, Inject } from '@nestjs/common';
import { Action } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

// import { UserID } from '@voiceflow/sdk-auth/nestjs';
import { MigrationService } from './migration.service';

@Controller()
export class LegacyLoguxController {
  constructor(@Inject(MigrationService) private readonly migrationService: MigrationService) {
    // eslint-disable-next-line no-console
    console.log('LEGACY LOGUX CONTROLLER CONSTRUCTOR');
  }

  @Action(Realtime.version.schema.negotiate.started)
  // @UseRequestContext()
  public async negotiate() {
    // eslint-disable-next-line no-console
    console.log('NEGOTIATE NEW ACTION');
    return this.migrationService.migrate({ payload: { creatorID: 1, versionID: '23321231', proposedSchemaVersion: 1 }, ctx: {} as any });
  }
}
