import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord, Utils } from '@voiceflow/common';
import Hashids from 'hashids/esm/hashids';
import _ from 'lodash';

import AbstractModel from '../_mongo';
import { Adapter, Bson, HashID } from '../utils';

const DOUBLE_KEYS = ['_version'] as const;
const HASH_ID_KEYS = ['teamID'] as const;
const READ_ONLY_KEYS = ['_id', 'teamID', 'creatorID'] as const;
const OBJECT_ID_KEYS = ['_id', 'devVersion', 'liveVersion'] as const;

type DBProjectModel = HashID.HashIDToNumber<
  Bson.NumberToDouble<
    Bson.StringToObjectID<BaseModels.Project.Model<AnyRecord, AnyRecord>, typeof OBJECT_ID_KEYS[number]>,
    typeof DOUBLE_KEYS[number]
  >,
  typeof HASH_ID_KEYS[number]
>;

// TODO: add other methods like get, patch, delete, etc.
class ProjectModel extends AbstractModel<DBProjectModel, BaseModels.Project.Model<AnyRecord, AnyRecord>, typeof READ_ONLY_KEYS[number]> {
  READ_ONLY_KEYS = READ_ONLY_KEYS;

  public collectionName = 'projects';

  // TODO: replace with an actual teamhashid, shouldn't be used for now, adding just to make correct types
  workspaceHashID = new Hashids();

  /**
   * should not be used until the `workspaceHashID` is added to the clients
   */
  adapter = Adapter.factory<DBProjectModel, BaseModels.Project.Model<AnyRecord, AnyRecord>>(
    Utils.functional.compose(
      HashID.numberToHashID(HASH_ID_KEYS, this.workspaceHashID),
      Bson.doubleToNumber(DOUBLE_KEYS),
      Bson.objectIdToString(OBJECT_ID_KEYS)
    ),

    Utils.functional.compose(
      HashID.hashIDToNumber(HASH_ID_KEYS, this.workspaceHashID),
      Bson.numberToDouble(DOUBLE_KEYS),
      Bson.stringToObjectId(OBJECT_ID_KEYS)
    )
  );

  async getPlatformAndType(projectID: string): Promise<{ type?: string; platform?: string }> {
    return this.findByID(projectID, ['type', 'platform']);
  }
}

export default ProjectModel;
