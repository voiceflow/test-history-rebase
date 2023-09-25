import { UseRequestContext } from '@mikro-orm/core';
// import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, Context, Payload } from '@voiceflow/nestjs-logux';
// import { DatabaseTarget } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { MigrationService } from './migration.service';
import { ProjectService } from './project.service';

@Controller()
export class LegacyLoguxController {
  // orm: MikroORM;

  constructor(
    @Inject(ProjectService) private readonly projectService: ProjectService,
    @Inject(MigrationService) private readonly migrationService: MigrationService
  ) {
    // this.orm = orm;
  }

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

  // @Action(Realtime.project.merge)
  @UseRequestContext()
  public async merge(@Payload() payload: Realtime.project.MergeProjectsPayload, @Context() ctx: Context.Action) {
    return this.projectService.mergeTest(Number(ctx.userId), payload);
  }
}
