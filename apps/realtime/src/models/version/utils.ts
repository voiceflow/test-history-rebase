import { NestedMongoModel } from '../_mongo';
import type VersionModel from './index';

export abstract class PlatformDataModel extends NestedMongoModel<VersionModel> {
  readonly PLATFORM_DATA_PATH = 'platformData' as const;

  get PLATFORM_DATA_MODEL_PATH() {
    return `${this.PLATFORM_DATA_PATH}.${this.MODEL_PATH}`;
  }
}
