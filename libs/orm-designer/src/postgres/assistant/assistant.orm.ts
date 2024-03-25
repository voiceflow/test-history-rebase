import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { AssistantEntity } from './assistant.entity';
import { AssistantJSONAdapter } from './assistant-json.adapter';

export class AssistantORM extends PostgresCMSObjectORM<AssistantEntity> {
  Entity = AssistantEntity;

  jsonAdapter = AssistantJSONAdapter;

  findManyByWorkspace(workspaceID: number) {
    return this.find({ workspaceID });
  }
}
