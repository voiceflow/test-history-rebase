import { ObjectId } from '@mikro-orm/mongodb';

import { MongoAtomicORM } from '../common';
import { VariableStateEntity } from './variable-state.entity';

export class VariableStateORM extends MongoAtomicORM(VariableStateEntity) {
  findManyByProject(projectID: string) {
    return this.find({ projectID: new ObjectId(projectID) });
  }
}
