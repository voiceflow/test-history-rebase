import { PostgresCMSObjectORM } from '@/postgres/common';

import { ResponseMessageEntity } from './response-message.entity';
import { ResponseMessageJSONAdapter } from './response-message-json.adapter';

export class ResponseMessageORM extends PostgresCMSObjectORM<ResponseMessageEntity> {
  Entity = ResponseMessageEntity;

  jsonAdapter = ResponseMessageJSONAdapter;

  findManyByDiscriminators(environmentID: string, discriminatorIDs: string[]) {
    return this.find({ environmentID, discriminatorID: discriminatorIDs });
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
