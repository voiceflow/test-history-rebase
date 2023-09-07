import { BaseModels } from '@voiceflow/base-types';

import { AbstractControl } from '@/legacy/control';

class NoteService extends AbstractControl {
  public async upsert(versionID: string, note: BaseModels.BaseNote): Promise<void> {
    await this.models.version.note.upsert(versionID, note);
  }

  public async delete(versionID: string, noteID: string): Promise<void> {
    await this.models.version.note.delete(versionID, noteID);
  }

  public async deleteMany(versionID: string, noteIDs: string[]): Promise<void> {
    await this.models.version.note.deleteMany(versionID, noteIDs);
  }
}

export default NoteService;
