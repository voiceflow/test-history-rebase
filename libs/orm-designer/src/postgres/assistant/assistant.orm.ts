import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import type { PKOrEntity } from '@/types';

import type { WorkspaceStubEntity } from '../stubs/workspace.stub';
import { AssistantEntity } from './assistant.entity';

export class AssistantORM extends PostgresCMSObjectORM(AssistantEntity) {
  findManyByWorkspace(workspace: PKOrEntity<WorkspaceStubEntity>) {
    return this.find({ workspace });
  }
}
