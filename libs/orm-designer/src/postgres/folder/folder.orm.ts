import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';
import type { PKOrEntity } from '@/types';

import type { AssistantEntity } from '../assistant';
import { FolderEntity } from './folder.entity';

export class FolderORM extends PostgresCMSMutableORM(FolderEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }
}
