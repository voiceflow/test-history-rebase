import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import AbstractModel from '../_mongo';
import { Bson } from '../utils';

const READ_ONLY_KEYS = ['_id'] as const;
const OBJECT_ID_KEYS = ['_id', 'diagramID', 'versionID'] as const;

export type ProgramModelType = Omit<BaseModels.Program.Model, 'id'> & { _id: string };

type DBProgramModel = Bson.StringToObjectID<ProgramModelType, Realtime.ArrayItem<typeof OBJECT_ID_KEYS>>;

class ProgramModel extends AbstractModel<DBProgramModel, ProgramModelType, Realtime.ArrayItem<typeof READ_ONLY_KEYS>> {
  READ_ONLY_KEYS = READ_ONLY_KEYS;

  public collectionName = 'programs';

  adapter = createSmartMultiAdapter<DBProgramModel, ProgramModelType>(Bson.objectIdToString(OBJECT_ID_KEYS), Bson.stringToObjectId(OBJECT_ID_KEYS));
}
export default ProgramModel;
