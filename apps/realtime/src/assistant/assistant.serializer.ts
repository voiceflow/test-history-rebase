import { Inject, Injectable } from '@nestjs/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { AssistantEntity } from '@voiceflow/orm-designer';
import type { Assistant } from '@voiceflow/sdk-logux-designer';

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

  serialize(data: AssistantEntity): Assistant {
    return {
      ...this.entitySerializer.serialize(data),
      workspaceID: this.hashedID.encodeWorkspaceID(data.workspace.id),
    };
  }
}
