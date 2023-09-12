import { BaseModels } from '@voiceflow/base-types';

import { NestedMongoModel } from '../_mongo';
import { Atomic } from '../utils';
import type VersionModel from './index';

class NoteModel extends NestedMongoModel<VersionModel> {
  readonly MODEL_PATH = 'notes' as const;

  async upsert(versionID: string, note: BaseModels.BaseNote): Promise<BaseModels.BaseNote> {
    await this.model.updateByID(versionID, { [`${this.MODEL_PATH}.${note.id}`]: note });

    return note;
  }

  async delete(versionID: string, noteID: string): Promise<void> {
    return this.model.atomicUpdateByID(versionID, [Atomic.unset([{ path: `${this.MODEL_PATH}.${noteID}` }])]);
  }

  async deleteMany(versionID: string, noteIDs: string[]): Promise<void> {
    await this.model.atomicUpdateByID(
      versionID,
      noteIDs.map((noteID) => Atomic.unset([{ path: `${this.MODEL_PATH}.${noteID}` }]))
    );
  }
}

export default NoteModel;
