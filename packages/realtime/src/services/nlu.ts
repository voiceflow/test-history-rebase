import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '@/control';

class NluService extends AbstractControl {
  public async getAll(versionID: string): Promise<Realtime.NLUUnclassifiedData[]> {
    return this.models.version.nluUnclassifiedData.list(versionID).then(Realtime.Adapters.nlu.nluUnclassifiedDataAdapter.mapFromDB);
  }

  public async add(versionID: string, unclassifiedData: Realtime.NLUUnclassifiedData): Promise<void> {
    await this.models.version.nluUnclassifiedData.add(versionID, Realtime.Adapters.nlu.nluUnclassifiedDataAdapter.toDB(unclassifiedData));
  }

  public async remove(versionID: string, datasourceKey: string): Promise<void> {
    await this.models.version.nluUnclassifiedData.delete(versionID, datasourceKey);
  }
}

export default NluService;
