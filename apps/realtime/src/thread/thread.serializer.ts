import { Inject, Injectable } from '@nestjs/common';
import type { Thread } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { ThreadObject } from '@voiceflow/orm-designer';
import { ThreadJSONAdapter } from '@voiceflow/orm-designer';

import { BaseSerializer } from '@/common';

@Injectable()
export class ThreadSerializer extends BaseSerializer<ThreadObject, Thread> {
  constructor(
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService
  ) {
    super();
  }

  serialize(data: ThreadObject): Thread {
    return {
      ...ThreadJSONAdapter.fromDB(data),
      id: this.encodeID(data.id),
      projectID: data.assistantID,
    };
  }

  decodeID = (id: string): number => {
    return this.hashedID.decodeID(id);
  };

  encodeID = (id: number): string => {
    return this.hashedID.encodeID(id);
  };
}
