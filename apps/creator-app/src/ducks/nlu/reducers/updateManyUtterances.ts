import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const updateManyUtterances = createReducer(Realtime.nlu.updateManyUtterances, (state, { utterances }) => {
  const utterancesByDatasource = utterances.reduce<Record<string, Record<string, Realtime.NLUUnclassifiedUtterances>>>(
    (acc, utterance) => ({
      ...acc,
      [utterance.datasourceID]: { ...acc[utterance.datasourceID], [utterance.id]: utterance },
    }),
    {}
  );

  Object.entries(utterancesByDatasource).forEach(([datasourceID, utteranceMap]) => {
    const datasource = Normal.getOne(state, datasourceID);
    if (!datasource) return;
    datasource.utterances.forEach((utterance) => {
      const updatedUtterance = utteranceMap[utterance.id];

      if (!updatedUtterance) return;

      Object.assign(utterance, updatedUtterance);
    });
  });
});

export default updateManyUtterances;
