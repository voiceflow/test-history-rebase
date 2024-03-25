import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord } from '@voiceflow/common';
import { ProjectUserRole } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { ProjectObject } from '@voiceflow/orm-designer';
import { ProjectJSONAdapter } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { BaseSerializer } from '@/common';

@Injectable()
export class LegacyProjectSerializer extends BaseSerializer<ProjectObject, Realtime.AnyProject> {
  constructor(
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService
  ) {
    super();
  }

  serialize(data: ProjectObject, members: Array<{ role: ProjectUserRole; creatorID: number }> = []): Realtime.AnyProject {
    return Realtime.Adapters.projectAdapter.fromDB(
      { ...ProjectJSONAdapter.fromDB(data), teamID: this.hashedID.encodeWorkspaceID(data.teamID) } as BaseModels.Project.Model<AnyRecord, AnyRecord>,
      { members: members.map(({ role, creatorID }) => ({ role: role as Realtime.ProjectMember['role'], creatorID })) }
    );
  }
}
