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

  public async removeManyUtterances(versionID: string, utterances: Realtime.NLUUnclassifiedUtterances[]) {
    const updates = Object.entries(
      utterances.reduce((acc, utterance) => {
        const datasource = acc[utterance.datasourceID];

        return {
          ...acc,
          [utterance.datasourceID]: datasource ? [...datasource, utterance.id] : [utterance.id],
        };
      }, {} as Record<string, string[]>)
    ).map(([datasourceKey, utteranceIDs]) => ({ datasourceKey, utteranceIDs }));

    // TODO: adds support for removing many utterances from many datasources
    // await this.models.version.nluUnclassifiedData.removeManyUtterances(versionID, updates);

    return Promise.all(
      updates.map((update) =>
        this.models.version.nluUnclassifiedData.removeManyUtterancesFromDatasource(versionID, update.datasourceKey, update.utteranceIDs)
      )
    );
  }
}

export default NluService;
