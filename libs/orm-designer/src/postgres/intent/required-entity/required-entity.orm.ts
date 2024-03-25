import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { RequiredEntityEntity } from './required-entity.entity';
import { RequiredEntityJSONAdapter } from './required-entity-json.adapter';

export class RequiredEntityORM extends PostgresCMSObjectORM<RequiredEntityEntity> {
  Entity = RequiredEntityEntity;

  jsonAdapter = RequiredEntityJSONAdapter;

  findManyByIntents(environmentID: string, intentIDs: string[]) {
    return this.find({ environmentID, intentID: intentIDs });
  }

  findManyByEntities(environmentID: string, entityIDs: string[]) {
    return this.find({ environmentID, entityID: entityIDs });
  }

  findManyByReprompts(environmentID: string, repromptIDs: string[]) {
    return this.find({ environmentID, repromptID: repromptIDs });
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
