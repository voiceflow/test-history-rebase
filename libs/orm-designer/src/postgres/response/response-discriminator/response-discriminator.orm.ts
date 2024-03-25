import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { ResponseDiscriminatorEntity } from './response-discriminator.entity';
import { ResponseDiscriminatorJSONAdapter } from './response-discriminator-json.adapter';

export class ResponseDiscriminatorORM extends PostgresCMSObjectORM<ResponseDiscriminatorEntity> {
  Entity = ResponseDiscriminatorEntity;

  jsonAdapter = ResponseDiscriminatorJSONAdapter;

  findManyByResponses(environmentID: string, responseIDs: string[]) {
    return this.find({ environmentID, responseID: responseIDs });
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
