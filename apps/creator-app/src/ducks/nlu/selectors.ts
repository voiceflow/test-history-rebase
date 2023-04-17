import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  all: allUnclassifiedDataSelector,
  map: unclassifiedDataMapSelector,
  byID: unclassifiedDataByIDSelector,
  byIDs: unclassifiedDataByIDsSelector,
  allIDs: allUnclassifiedDataIDsSelector,
  getByID: getUnclassifiedDataByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const dataSourceNamesSelector = createSelector([allUnclassifiedDataSelector], (dataSources) => dataSources.map((d) => d.name));

export const allUnclassifiedUtterancesSelector = createSelector([allUnclassifiedDataSelector], (dataSources): Realtime.NLUUnclassifiedUtterances[] =>
  dataSources.flatMap((dataSource) => dataSource.utterances, [])
);

export const unclassifiedUtteranceByIDSelector = createSelector([allUnclassifiedUtterancesSelector], (utterances) =>
  Object.fromEntries(utterances.map((utterance) => [utterance.id, utterance]))
);
