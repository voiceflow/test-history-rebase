import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord, Utils } from '@voiceflow/common';
import { createSmartMultiAdapter } from 'bidirectional-adapter';
import _ from 'lodash';

import AbstractModel from '../_mongo';
import { Bson, HashID } from '../utils';

const DOUBLE_KEYS = ['_version'] as const;
const READ_ONLY_KEYS = ['_id', 'teamID', 'creatorID'] as const;
const OBJECT_ID_KEYS = ['_id', 'devVersion', 'liveVersion'] as const;
const TEAM_HASH_ID_KEYS = ['teamID'] as const;

type DBProjectModel = HashID.HashIDToNumber<
  Bson.NumberToDouble<
    Bson.StringToObjectID<BaseModels.Project.Model<AnyRecord, AnyRecord>, typeof OBJECT_ID_KEYS[number]>,
    typeof DOUBLE_KEYS[number]
  >,
  typeof TEAM_HASH_ID_KEYS[number]
>;

// TODO: add other methods like get, patch, delete, etc.
class ProjectModel extends AbstractModel<DBProjectModel, BaseModels.Project.Model<AnyRecord, AnyRecord>, typeof READ_ONLY_KEYS[number]> {
  READ_ONLY_KEYS = READ_ONLY_KEYS;

  public collectionName = 'projects';

  adapter = createSmartMultiAdapter<DBProjectModel, BaseModels.Project.Model<AnyRecord, AnyRecord>>(
    Utils.functional.compose(
      HashID.numberToHashID(TEAM_HASH_ID_KEYS, this.clients.teamHashids),
      Bson.doubleToNumber(DOUBLE_KEYS),
      Bson.objectIdToString(OBJECT_ID_KEYS)
    ),

    Utils.functional.compose(
      HashID.hashIDToNumber(TEAM_HASH_ID_KEYS, this.clients.teamHashids),
      Bson.numberToDouble(DOUBLE_KEYS),
      Bson.stringToObjectId(OBJECT_ID_KEYS)
    )
  );

  async getPlatformAndType(projectID: string): Promise<{ type?: string; platform?: string }> {
    return this.findByID(projectID, ['type', 'platform']);
  }
}

export default ProjectModel;
