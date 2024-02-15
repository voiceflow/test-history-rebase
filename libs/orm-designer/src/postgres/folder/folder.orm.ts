import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';
import type { PKOrEntity } from '@/types';

import type { AssistantEntity } from '../assistant';
import { FolderEntity } from './folder.entity';

export class FolderORM extends PostgresCMSObjectORM(FolderEntity) {
  findManyParents(folders: PKOrEntity<FolderEntity>[]) {
    return this.find({ parent: folders });
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }
}
