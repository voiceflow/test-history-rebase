import { BaseModels } from '@voiceflow/base-types';

import { AbstractControl } from '@/control';

class NluService extends AbstractControl {
  public async getAll<NLUUnclassifiedData extends BaseModels.Version.NLUUnclassifiedData>(versionID: string): Promise<NLUUnclassifiedData[]> {
    return this.models.version.nluUnclassifiedData.list<NLUUnclassifiedData>(versionID);
  }

  public async add<NLUUnclassifiedData extends BaseModels.Version.NLUUnclassifiedData>(
    versionID: string,
    unclassifiedData: NLUUnclassifiedData
  ): Promise<void> {
    await this.models.version.nluUnclassifiedData.add(versionID, unclassifiedData);
  }
}

export default NluService;
