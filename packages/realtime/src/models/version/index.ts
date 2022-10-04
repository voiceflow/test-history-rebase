import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { createSmartMultiAdapter } from 'bidirectional-adapter';
import { ObjectId } from 'bson';

import AbstractModel from '../_mongo';
import { Atomic, Bson } from '../utils';
import CanvasTemplate from './canvasTemplate';
import Component from './component';
import Domain from './domain';
import Intent from './intent';
import NluUnclassifiedData from './nluUnclassifiedData';
import Note from './note';
import Slot from './slot';
import Variable from './variable';

const DOUBLE_KEYS = ['_version'] as const;
const READ_ONLY_KEYS = ['_id', 'creatorID', 'projectID'] as const;
const OBJECT_ID_KEYS = ['_id', 'projectID', 'rootDiagramID', 'templateDiagramID'] as const;

type DBVersionModel = Bson.NumberToDouble<
  Bson.StringToObjectID<BaseModels.Version.Model<BaseModels.Version.PlatformData>, typeof OBJECT_ID_KEYS[number]>,
  typeof DOUBLE_KEYS[number]
>;

class VersionModel extends AbstractModel<DBVersionModel, BaseModels.Version.Model<BaseModels.Version.PlatformData>, typeof READ_ONLY_KEYS[number]> {
  READ_ONLY_KEYS = READ_ONLY_KEYS;

  note = new Note(this);

  slot = new Slot(this);

  intent = new Intent(this);

  domain = new Domain(this);

  variable = new Variable(this);

  component = new Component(this);

  canvasTemplate = new CanvasTemplate(this);

  nluUnclassifiedData = new NluUnclassifiedData(this);

  collectionName = 'versions';

  adapter = createSmartMultiAdapter<DBVersionModel, BaseModels.Version.Model<BaseModels.Version.PlatformData>>(
    Utils.functional.compose(Bson.doubleToNumber(DOUBLE_KEYS), Bson.objectIdToString(OBJECT_ID_KEYS)),
    Utils.functional.compose(Bson.numberToDouble(DOUBLE_KEYS), Bson.stringToObjectId(OBJECT_ID_KEYS))
  );

  async updatePrototype(versionID: string, data: Record<string, any>, path?: string) {
    const fieldPath = path ? `${path}.` : '';
    const fields = Object.fromEntries(Object.keys(data).map((key) => [`prototype.${fieldPath}${key}`, data[key]]));

    await this.updateByID(versionID, fields);

    return data;
  }

  async updatePlatformData(versionID: string, data: Record<string, any>, path?: string) {
    const fieldPath = path ? `${path}.` : '';
    const fields = Object.fromEntries(Object.keys(data).map((key) => [`platformData.${fieldPath}${key}`, data[key]]));

    await this.updateByID(versionID, fields);

    return data;
  }

  async updateDefaultStepColors(versionID: string, data: BaseModels.Version.DefaultStepColors) {
    const fields = Object.fromEntries(Utils.object.getKeys(data).map((key) => [`defaultStepColors.${key}`, data[key]]));

    await this.updateByID(versionID, fields);

    return data;
  }

  async findManyByProjectID(projectID: string): Promise<DBVersionModel[]>;

  async findManyByProjectID<Key extends keyof DBVersionModel>(projectID: string, fields: Key[]): Promise<Pick<DBVersionModel, Key>[]>;

  async findManyByProjectID(projectID: string, fields?: (keyof DBVersionModel)[]): Promise<Partial<DBVersionModel>[]>;

  async findManyByProjectID(projectID: string, fields?: (keyof DBVersionModel)[]): Promise<Partial<DBVersionModel>[]> {
    return this.findMany({ projectID: new ObjectId(projectID) }, fields);
  }

  /**
   * @deprecated should be removed with domains PR
   */
  async reorderTopics(versionID: string, topicID: string, index: number) {
    const version = await this.findAndAtomicUpdateByID(versionID, [Atomic.pull([{ path: 'topics', match: { sourceID: topicID } }])]);

    const item = version.topics?.find((folder) => folder.sourceID === topicID);

    if (!item) throw new Error('Could not find item to reorder');

    await this.atomicUpdateByID(versionID, [Atomic.push([{ path: 'topics', value: item, index }])]);

    return item;
  }
}

export default VersionModel;
