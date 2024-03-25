import { ObjectId } from '@mikro-orm/mongodb';

import { MongoAtomicORM } from '../common';
import { VariableStateEntity } from './variable-state.entity';
import { VariableStateJSONAdapter } from './variable-state-json.adapter';

export class VariableStateORM extends MongoAtomicORM<VariableStateEntity> {
  Entity = VariableStateEntity;

  jsonAdapter = VariableStateJSONAdapter;

  findManyByProject(projectID: string) {
    return this.find({ projectID: new ObjectId(projectID) });
  }
}
