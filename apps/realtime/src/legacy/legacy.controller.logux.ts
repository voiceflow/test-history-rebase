import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Payload } from '@voiceflow/nestjs-logux';
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
  public async negotiate(@Payload() payload: any) {
    // eslint-disable-next-line no-console
    console.log('NEGOTIATE NEW ACTION', { payload });
    return this.migrationService.migrate({ payload: { creatorID: 1, versionID: '23321231', proposedSchemaVersion: 1 }, ctx: {} as any });
  }
}
