import { BaseModels } from '@voiceflow/base-types';
import { createSmartMultiAdapter } from 'bidirectional-adapter';
import { ObjectId } from 'bson';

import AbstractModel from '../_mongo';
import { Bson } from '../utils';

const READ_ONLY_KEYS = ['_id'] as const;
const OBJECT_ID_KEYS = ['_id', 'projectID'] as const;

type DBVariableStateModel = Bson.StringToObjectID<BaseModels.VariableState.Model, (typeof OBJECT_ID_KEYS)[number]>;

class VariableStateModel extends AbstractModel<DBVariableStateModel, BaseModels.VariableState.Model, (typeof READ_ONLY_KEYS)[number]> {
  READ_ONLY_KEYS = READ_ONLY_KEYS;

  public collectionName = 'variable-states';

  adapter = createSmartMultiAdapter<DBVariableStateModel, BaseModels.VariableState.Model>(
    Bson.objectIdToString(OBJECT_ID_KEYS),
    Bson.stringToObjectId(OBJECT_ID_KEYS)
  );

  async findManyByProjectID(projectID: string) {
    return this.findMany({ projectID: new ObjectId(projectID) });
  }
}
export default VariableStateModel;
