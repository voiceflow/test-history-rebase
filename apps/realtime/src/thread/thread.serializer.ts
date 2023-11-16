import { Inject, Injectable } from '@nestjs/common';
import type { Thread } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { ThreadEntity } from '@voiceflow/orm-designer';

import { BaseSerializer, EntitySerializer } from '@/common';

@Injectable()
export class ThreadSerializer extends BaseSerializer<ThreadEntity, Thread> {
  constructor(
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  decodeID = (id: string): number => {
    return this.hashedID.decodeID(id);
  };

  encodeID = (id: number): string => {
    return this.hashedID.encodeID(id);
  };

  serialize(data: ThreadEntity): Thread {
    return {
      ...this.entitySerializer.serialize(data),
      id: this.encodeID(data.id),
      projectID: data.assistantID,
    };
  }
}
