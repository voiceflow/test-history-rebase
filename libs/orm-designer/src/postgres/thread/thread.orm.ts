import { PostgresMutableORM } from '@/postgres/common/postgres-mutable.orm';

import { ThreadEntity } from './thread.entity';

export class ThreadORM extends PostgresMutableORM(ThreadEntity) {
  findManyByDiagrams(diagramIDs: string[]) {
    return this.find({ diagramID: diagramIDs });
  }

  findManyByAssistant(assistantID: string) {
    return this.find({ assistantID }, { orderBy: { id: 'ASC' } });
  }
}
