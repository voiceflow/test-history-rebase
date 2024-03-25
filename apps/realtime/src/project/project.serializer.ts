import { Inject, Injectable } from '@nestjs/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { ProjectJSON, ProjectObject } from '@voiceflow/orm-designer';
import { ProjectJSONAdapter } from '@voiceflow/orm-designer';

import { BaseSerializer } from '@/common';

@Injectable()
export class ProjectSerializer extends BaseSerializer<ProjectObject, Omit<ProjectJSON, 'teamID'> & { teamID: string }> {
  constructor(
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService
  ) {
    super();
  }

  encodeWorkspaceID(workspaceID: number) {
    return this.hashedID.encodeWorkspaceID(workspaceID);
  }

  decodeWorkspaceID(workspaceID: string) {
    return this.hashedID.decodeWorkspaceID(workspaceID);
  }

  serialize(data: ProjectObject): Omit<ProjectJSON, 'teamID'> & { teamID: string } {
    return {
      ...ProjectJSONAdapter.fromDB(data),
      teamID: this.encodeWorkspaceID(data.teamID),
    };
  }
}
