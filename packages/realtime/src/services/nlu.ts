import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '@/control';

class NluService extends AbstractControl {
  public async getAll(versionID: string): Promise<Realtime.NluUnclassifiedData[]> {
    return this.models.version.nluUnclassifiedData.list(versionID).then(Realtime.Adapters.nlu.nluUnclassifiedDataAdapter.mapFromDB);
  }

  public async add(versionID: string, unclassifiedData: Realtime.NluUnclassifiedData): Promise<void> {
    await this.models.version.nluUnclassifiedData.add(versionID, Realtime.Adapters.nlu.nluUnclassifiedDataAdapter.toDB(unclassifiedData));
  }

  public async remove(versionID: string, intentKey: string): Promise<void> {
    await this.models.version.nluUnclassifiedData.delete(versionID, intentKey);
  }
}

export default NluService;
