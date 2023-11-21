import { Inject, Injectable } from '@nestjs/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { ProjectEntity, ToJSON } from '@voiceflow/orm-designer';

import { BaseSerializer, EntitySerializer } from '@/common';

@Injectable()
export class ProjectSerializer extends BaseSerializer<ProjectEntity, Omit<ToJSON<ProjectEntity>, 'teamID'> & { teamID: string }> {
  constructor(
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  encodeWorkspaceID(workspaceID: number) {
    return this.hashedID.encodeWorkspaceID(workspaceID);
  }

  decodeWorkspaceID(workspaceID: string) {
    return this.hashedID.decodeWorkspaceID(workspaceID);
  }

  serialize(data: ProjectEntity): Omit<ToJSON<ProjectEntity>, 'teamID'> & { teamID: string } {
    return {
      ...this.entitySerializer.serialize(data),
      teamID: this.encodeWorkspaceID(data.teamID),
    };
  }

  deserialize(data: Omit<ToJSON<ProjectEntity>, 'teamID' | 'id'> & { teamID: string }): Omit<ToJSON<ProjectEntity>, 'id'> {
    return {
      ...data,
      teamID: this.decodeWorkspaceID(data.teamID),
    };
  }
}
