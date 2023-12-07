import type { AssistantEntity } from '@/main';
import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import type { PKOrEntity } from '@/types';

import { MediaAttachmentEntity } from './media-attachment.entity';

export class MediaAttachmentORM extends PostgresCMSObjectORM(MediaAttachmentEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID });
  }
}
