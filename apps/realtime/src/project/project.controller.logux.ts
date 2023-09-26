import { UseRequestContext } from '@mikro-orm/core';
import { Controller, Inject } from '@nestjs/common';
import { Action, Context, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { ProjectService } from './project.service';

@Controller()
export class ProjectLoguxController {
  constructor(@Inject(ProjectService) private readonly projectService: ProjectService) {}

  @Action.Async(Realtime.project.merge)
  @UseRequestContext()
  public async merge(@Payload() payload: Realtime.project.MergeProjectsPayload, @Context() ctx: Context.Action) {
    return this.projectService.merge(Number(ctx.userId), { payload, ctx });
  }
}
