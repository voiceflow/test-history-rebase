import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  all: allUnclassifiedDataSelector,
  map: unclassifiedDataMapSelector,
  byID: unclassifiedDataByIDSelector,
  byIDs: unclassifiedDataByIDsSelector,
  getByID: getUnclassifiedDataByIDSelector,
  allIDs: allUnclassifiedDataIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const datasourceNames = createSelector([allUnclassifiedDataSelector], (datasources) => datasources.map((d) => d.name));

export const allUnclassifiedUtterancesSelector = createSelector(
  [allUnclassifiedDataSelector],
  (datasources): Realtime.NLUUnclassifiedUtterances[] => {
    return datasources.flatMap((datasource) => datasource.utterances, []);
  }
);

export const utterancesByID = createSelector([allUnclassifiedUtterancesSelector], (utterances) => {
  return utterances.reduce(
    (utterancesByID, utterance) => ({
      ...utterancesByID,
      [utterance.id]: utterance,
    }),
    {} as Record<string, Realtime.NLUUnclassifiedUtterances>
  );
});
