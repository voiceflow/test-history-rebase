import { BaseModels } from '@voiceflow/base-types';

import { AbstractControl } from '@/control';

class NoteService extends AbstractControl {
  public async upsert(creatorID: number, versionID: string, note: BaseModels.BaseNote): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.note.upsert(versionID, note);
  }

  public async delete(creatorID: number, versionID: string, noteID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.note.delete(versionID, noteID);
  }

  public async deleteMany(creatorID: number, versionID: string, noteIDs: string[]): Promise<void[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return Promise.all(noteIDs.map((noteID) => client.note.delete(versionID, noteID)));
  }
}

export default NoteService;
