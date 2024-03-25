import { PostgresMutableORM } from '@/postgres/common/orms/postgres-mutable.orm';

import { ThreadEntity } from './thread.entity';
import { ThreadJSONAdapter } from './thread-json.adapter';

export class ThreadORM extends PostgresMutableORM<ThreadEntity> {
  Entity = ThreadEntity;

  jsonAdapter = ThreadJSONAdapter;

  findManyByDiagrams(diagramIDs: string[]) {
    return this.find({ diagramID: diagramIDs });
  }

  findManyByAssistant(assistantID: string) {
    return this.find({ assistantID }, { orderBy: { id: 'asc' } });
  }
}
