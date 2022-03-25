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
}

export default NoteService;
