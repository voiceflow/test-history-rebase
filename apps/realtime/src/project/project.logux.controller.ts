import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

import { InjectRequestContext, UseRequestContext } from '@/common';

import { ProjectMergeService } from './project-merge.service';

@Controller()
@InjectRequestContext()
export class ProjectLoguxController {
  constructor(
    @Inject(ProjectMergeService)
    private readonly projectMergeService: ProjectMergeService
  ) {}

  @Action.Async(Realtime.project.merge)
  @Authorize.Permissions<Realtime.project.MergeProjectsPayload>([Permission.PROJECT_UPDATE], ({ sourceProjectID, targetProjectID }) => [
    { id: sourceProjectID, kind: 'project' },
    { id: targetProjectID, kind: 'project' },
  ])
  @UseRequestContext()
  public async merge(@Payload() payload: Realtime.project.MergeProjectsPayload, @AuthMeta() authMeta: AuthMetaPayload) {
    return this.projectMergeService.merge({ payload, authMeta });
  }
}
