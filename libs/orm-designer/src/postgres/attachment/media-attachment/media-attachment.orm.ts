import type { AssistantEntity } from '@/main';
import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';
import type { PKOrEntity } from '@/types';

import { MediaAttachmentEntity } from './media-attachment.entity';

export class MediaAttachmentORM extends PostgresCMSMutableORM(MediaAttachmentEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID });
  }
}
