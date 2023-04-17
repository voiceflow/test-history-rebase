import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const removeManyUtterances = createReducer(Realtime.nlu.removeManyUtterances, (state, { utterances }) => {
  const utterancesIDsByDatasource = utterances.reduce<Record<string, string[]>>(
    (acc, utterance) => ({
      ...acc,
      [utterance.datasourceID]: acc[utterance.datasourceID] ? [...acc[utterance.datasourceID], utterance.id] : [utterance.id],
    }),
    {}
  );

  Object.entries(utterancesIDsByDatasource).forEach(([datasourceID, utterances]) => {
    const datasource = Normal.getOne(state, datasourceID);

    if (!datasource) return;

    datasource.utterances = datasource.utterances.filter((utterance) => !utterances.includes(utterance.id));
  });
});

export default removeManyUtterances;
