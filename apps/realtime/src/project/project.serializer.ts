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

  serialize(data: ProjectEntity): Omit<ToJSON<ProjectEntity>, 'teamID'> & { teamID: string } {
    return {
      ...this.entitySerializer.serialize(data),
      teamID: this.hashedID.encodeWorkspaceID(data.teamID),
    };
  }
}
