import { createSelector } from 'reselect';

import { createCurriedSelector } from '@/ducks/utils';

import { createByFolderIDSelectors } from '../../utils';
import { getAllByIntentID as getAllUtterancesByIntentID } from '../utterance/utterance.select';
import { all, oneByID } from './crud.select';

export const { allByFolderID, countByFolderID } = createByFolderIDSelectors(all);

export const allWithUtterances = createSelector(all, getAllUtterancesByIntentID, (entities, getUtterances) =>
  entities.map((intent) => ({ ...intent, utterances: getUtterances({ intentID: intent.id }) }))
);

export const oneWithUtterances = createSelector(
  oneByID,
  getAllUtterancesByIntentID,
  (intent, getUtterances) => intent && { ...intent, utterances: getUtterances({ intentID: intent.id }) }
);

export const getOneWithUtterances = createCurriedSelector(oneWithUtterances);

export const nameByID = createSelector(oneByID, (intent) => intent?.name ?? null);

export const entityOrderByID = createSelector(oneByID, (intent) => intent?.entityOrder ?? null);

export const automaticRepromptByID = createSelector(oneByID, (intent) => intent?.automaticReprompt ?? null);
