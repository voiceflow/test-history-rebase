import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';

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
  [allUnclassifiedDataSelector, WorkspaceV2.memberByCreatorIDSelector],
  (datasources, getMemberByCreatorID): Realtime.NLUUnclassifiedUtterances[] => {
    return datasources.reduce(
      (utterances, datasource) => [
        ...utterances,
        ...datasource.utterances.map(
          (u) =>
            ({
              ...u,
              sourceID: datasource.id.toString(),
              importedByUser: getMemberByCreatorID({ id: u.sourceID })?.name,
              datasourceID: datasource.id,
              datasourceName: datasource.name,
            } as Realtime.NLUUnclassifiedUtterances)
        ),
      ],
      [] as Realtime.NLUUnclassifiedUtterances[]
    );
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
