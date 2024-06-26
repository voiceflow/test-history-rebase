import type { BaseModels, BaseVersion } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createSmartMultiAdapter } from 'bidirectional-adapter';
import { ObjectId } from 'bson';

import AbstractModel from '../_mongo';
import { Adapter, Bson } from '../utils';
import CanvasTemplate from './canvasTemplate';
import Component from './component';
import type { DBVersionModel } from './constants';
import { VERSION_DOMAINS_KEYS, VERSION_DOUBLE_KEYS, VERSION_OBJECT_ID_KEYS, VERSION_READ_ONLY_KEYS } from './constants';
import CustomBlock from './customBlock';
import Domain from './domain';
import Variable from './variable';

class VersionModel extends AbstractModel<
  DBVersionModel,
  BaseVersion.Version,
  Realtime.ArrayItem<typeof VERSION_READ_ONLY_KEYS>
> {
  READ_ONLY_KEYS = VERSION_READ_ONLY_KEYS;

  domain = new Domain(this);

  variable = new Variable(this);

  component = new Component(this);

  customBlock = new CustomBlock(this);

  canvasTemplate = new CanvasTemplate(this);

  collectionName = 'versions';

  adapter = createSmartMultiAdapter<DBVersionModel, BaseVersion.Version>(
    Utils.functional.compose(
      Adapter.mapFromDB(VERSION_DOMAINS_KEYS, this.domain.adapter),
      Bson.doubleToNumber(VERSION_DOUBLE_KEYS),
      Bson.objectIdToString(VERSION_OBJECT_ID_KEYS)
    ),
    Utils.functional.compose(
      Adapter.mapToDB(VERSION_DOMAINS_KEYS, this.domain.adapter),
      Bson.numberToDouble(VERSION_DOUBLE_KEYS),
      Bson.stringToObjectId(VERSION_OBJECT_ID_KEYS)
    )
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

  async findManyByProjectID<Key extends keyof DBVersionModel>(
    projectID: string,
    fields: Key[]
  ): Promise<Pick<DBVersionModel, Key>[]>;

  async findManyByProjectID(projectID: string, fields?: (keyof DBVersionModel)[]): Promise<Partial<DBVersionModel>[]>;

  async findManyByProjectID(projectID: string, fields?: (keyof DBVersionModel)[]): Promise<Partial<DBVersionModel>[]> {
    return this.findMany({ projectID: new ObjectId(projectID) }, fields);
  }
}

export default VersionModel;
