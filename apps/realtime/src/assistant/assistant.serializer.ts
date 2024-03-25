import { Inject, Injectable } from '@nestjs/common';
import type { Assistant } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { AssistantObject } from '@voiceflow/orm-designer';
import { AssistantJSONAdapter } from '@voiceflow/orm-designer';

import { BaseSerializer } from '@/common';

@Injectable()
export class AssistantSerializer extends BaseSerializer<AssistantObject, Assistant> {
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

  serialize(data: AssistantObject): Assistant {
    return {
      ...AssistantJSONAdapter.fromDB(data),
      workspaceID: this.encodeWorkspaceID(data.workspaceID),
    };
  }
}
