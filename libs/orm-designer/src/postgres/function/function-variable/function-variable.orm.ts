import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { FunctionVariableEntity } from './function-variable.entity';
import { FunctionVariableJSONAdapter } from './function-variable-json.adapter';

export class FunctionVariableORM extends PostgresCMSObjectORM<FunctionVariableEntity> {
  Entity = FunctionVariableEntity;

  jsonAdapter = FunctionVariableJSONAdapter;

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
