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

export const allUnclassifiedUtterancesSelector = createSelector([allUnclassifiedDataSelector], (datasources) => {
  return datasources.reduce(
    (utterances, datasource) => [
      ...utterances,
      ...datasource.utterances.map((u) => ({ ...u, id: u.utterance, sourceID: datasource.id.toString() } as Realtime.NLUUnclassifiedUtterances)),
    ],
    [] as Realtime.NLUUnclassifiedUtterances[]
  );
});
