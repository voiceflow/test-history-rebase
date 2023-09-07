import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '@/legacy/control';

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

  private mapUtterancesUpdates(utterances: Realtime.NLUUnclassifiedUtterances[]) {
    return Object.entries(
      utterances.reduce((acc, utterance) => {
        const datasource = acc[utterance.datasourceID];

        return {
          ...acc,
          [utterance.datasourceID]: datasource ? [...datasource, utterance] : [utterance],
        };
      }, {} as Record<string, Realtime.NLUUnclassifiedUtterances[]>)
    ).map(([datasourceKey, utterances]) => ({ datasourceKey, utterances }));
  }

  public async updateManyUtterances(versionID: string, utterances: Realtime.NLUUnclassifiedUtterances[]) {
    const updates = this.mapUtterancesUpdates(utterances);

    return Promise.all(
      updates.map((update) =>
        this.models.version.nluUnclassifiedData.updateManyUtterancesFromDatasource(versionID, update.datasourceKey, update.utterances)
      )
    );
  }

  public async removeManyUtterances(versionID: string, utterances: Realtime.NLUUnclassifiedUtterances[]) {
    const updates = this.mapUtterancesUpdates(utterances);

    return Promise.all(
      updates.map((update) =>
        this.models.version.nluUnclassifiedData.removeManyUtterancesFromDatasource(
          versionID,
          update.datasourceKey,
          update.utterances.map((u) => u.id)
        )
      )
    );
  }
}

export default NluService;
