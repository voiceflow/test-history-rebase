import { Inject, Injectable } from '@nestjs/common';
import type { ThreadComment } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { ThreadCommentEntity } from '@voiceflow/orm-designer';

import { BaseSerializer, EntitySerializer } from '@/common';

@Injectable()
export class ThreadCommentSerializer extends BaseSerializer<ThreadCommentEntity, ThreadComment> {
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

  serialize(data: ThreadCommentEntity): ThreadComment {
    return {
      ...this.entitySerializer.serialize(data),
      id: this.encodeID(data.id),
      created: data.createdAt.toString(),
      threadID: this.encodeID(data.thread.id),
    };
  }
}
