import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord } from '@voiceflow/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { ProjectEntity } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { BaseSerializer, EntitySerializer } from '@/common';

@Injectable()
export class LegacyProjectSerializer extends BaseSerializer<ProjectEntity, Realtime.AnyProject> {
  constructor(
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  serialize(data: ProjectEntity): Realtime.AnyProject {
    return Realtime.Adapters.projectAdapter.fromDB(
      { ...this.entitySerializer.serialize(data), teamID: this.hashedID.encodeWorkspaceID(data.teamID) } as BaseModels.Project.Model<
        AnyRecord,
        AnyRecord
      >,
      { members: [] }
    );
  }
}
