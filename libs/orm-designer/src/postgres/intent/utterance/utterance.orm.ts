import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { UtteranceEntity } from './utterance.entity';
import { UtteranceJSONAdapter } from './utterance-json.adapter';

export class UtteranceORM extends PostgresCMSObjectORM<UtteranceEntity> {
  Entity = UtteranceEntity;

  jsonAdapter = UtteranceJSONAdapter;

  findManyByIntents(environmentID: string, intentIDs: string[]) {
    return this.find({ environmentID, intentID: intentIDs });
  }

  findManyByEnvironment(environmentID: string) {
    return this.find({ environmentID });
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.find({ environmentID, id: ids });
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.delete({ environmentID, id: ids });
  }
}
