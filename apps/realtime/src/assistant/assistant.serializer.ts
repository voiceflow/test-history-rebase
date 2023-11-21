import { Inject, Injectable } from '@nestjs/common';
import type { Assistant } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { AssistantEntity } from '@voiceflow/orm-designer';

import { BaseSerializer, EntitySerializer } from '@/common';

@Injectable()
export class AssistantSerializer extends BaseSerializer<AssistantEntity, Assistant> {
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

  serialize(data: AssistantEntity): Assistant {
    return {
      ...this.entitySerializer.serialize(data),
      workspaceID: this.encodeWorkspaceID(data.workspace.id),
    };
  }
}
