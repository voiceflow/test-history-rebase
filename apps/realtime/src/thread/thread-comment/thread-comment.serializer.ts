import { Inject, Injectable } from '@nestjs/common';
import type { ThreadComment } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { ThreadCommentObject } from '@voiceflow/orm-designer';
import { ThreadCommentJSONAdapter } from '@voiceflow/orm-designer';

import { BaseSerializer } from '@/common';

@Injectable()
export class ThreadCommentSerializer extends BaseSerializer<ThreadCommentObject, ThreadComment> {
  constructor(
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService
  ) {
    super();
  }

  decodeID = (id: string): number => {
    return this.hashedID.decodeID(id);
  };

  encodeID = (id: number): string => {
    return this.hashedID.encodeID(id);
  };

  serialize(data: ThreadCommentObject): ThreadComment {
    return {
      ...ThreadCommentJSONAdapter.fromDB(data),
      id: this.encodeID(data.id),
      created: data.createdAt.toString(),
      threadID: this.encodeID(data.threadID),
    };
  }
}
