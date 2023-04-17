import { NestedMongoModel } from '../_mongo';
import { Atomic } from '../utils';
import type VersionModel from './index';

class VariableModel extends NestedMongoModel<VersionModel> {
  readonly MODEL_PATH = 'variables' as const;

  async add({ index, variable, versionID }: { index?: number; variable: string; versionID: string }): Promise<void> {
    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.MODEL_PATH, value: variable, index }])]);
  }

  async addMany({ index, variables, versionID }: { index?: number; variables: string[]; versionID: string }): Promise<void> {
    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.MODEL_PATH, value: variables, index }])]);
  }

  async remove({ variable, versionID }: { variable: string; versionID: string }): Promise<void> {
    await this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.MODEL_PATH, match: variable }])]);
  }

  async removeMany({ variables, versionID }: { variables: string[]; versionID: string }): Promise<void> {
    await this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.MODEL_PATH, match: { $in: variables } }])]);
  }
}

export default VariableModel;
