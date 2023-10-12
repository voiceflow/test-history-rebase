import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';
import type { PKOrEntity } from '@/types';

import type { WorkspaceStubEntity } from '../stubs/workspace.stub';
import { AssistantEntity } from './assistant.entity';

export class AssistantORM extends PostgresCMSMutableORM(AssistantEntity) {
  findManyByWorkspace(workspace: PKOrEntity<WorkspaceStubEntity>) {
    return this.find({ workspace });
  }
}
