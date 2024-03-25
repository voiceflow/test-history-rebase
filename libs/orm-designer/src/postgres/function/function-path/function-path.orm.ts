import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { FunctionPathEntity } from './function-path.entity';
import { FunctionPatchJSONAdapter } from './function-path-json.adapter';

export class FunctionPathORM extends PostgresCMSObjectORM<FunctionPathEntity> {
  Entity = FunctionPathEntity;

  jsonAdapter = FunctionPatchJSONAdapter;

  findManyByFunctions(environmentID: string, functionIDs: string[]) {
    return this.find({ environmentID, functionID: functionIDs });
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
