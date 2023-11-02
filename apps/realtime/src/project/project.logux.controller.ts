import { MikroORM, RequestContext } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Payload } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';

import { ProjectService } from './project.service';

@Controller()
export class ProjectLoguxController {
  constructor(
    @Inject(getMikroORMToken(DatabaseTarget.MONGO))
    readonly mongoORM: MikroORM,
    @Inject(getMikroORMToken(DatabaseTarget.POSTGRES))
    readonly postgresORM: MikroORM,
    @Inject(ProjectService)
    private readonly projectService: ProjectService
  ) {}

  @Action.Async(Realtime.project.merge)
  @Authorize.Permissions<Realtime.project.MergeProjectsPayload>([Permission.PROJECT_UPDATE], ({ sourceProjectID, targetProjectID }) => [
    { id: sourceProjectID, kind: 'project' },
    { id: targetProjectID, kind: 'project' },
  ])
  public async merge(@Payload() payload: Realtime.project.MergeProjectsPayload, @AuthMeta() authMeta: AuthMetaPayload) {
    return RequestContext.createAsync([this.mongoORM.em, this.postgresORM.em], () => this.projectService.merge({ payload, authMeta }));
  }
}
