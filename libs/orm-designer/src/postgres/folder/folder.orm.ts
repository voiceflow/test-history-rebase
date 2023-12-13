import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import type { PKOrEntity } from '@/types';

import type { AssistantEntity } from '../assistant';
import { FolderEntity } from './folder.entity';

export class FolderORM extends PostgresCMSObjectORM(FolderEntity) {
  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }
}
