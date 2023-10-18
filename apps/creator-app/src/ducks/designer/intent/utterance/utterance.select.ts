import { createSelector } from 'reselect';

import { createCurriedSelector, createSubSelector } from '@/ducks/utils';
import { getMarkupEntityIDs } from '@/utils/markup.util';

import { createDesignerCRUDSelectors, intentIDParamSelector, intentIDsParamSelector } from '../../utils';
import * as IntentSelect from '../intent.select';
import { STATE_KEY } from './utterance.state';

const root = createSubSelector(IntentSelect.root, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const allByIntentID = createSelector(all, intentIDParamSelector, (utterances, intentID) =>
  !intentID
    ? []
    : utterances
        .filter((utterance) => utterance.intentID === intentID)
        .sort((l, r) => new Date(r.createdAt).getTime() - new Date(l.createdAt).getTime())
);

export const getAllByIntentID = createCurriedSelector(allByIntentID);

export const countByIntentID = createSelector(allByIntentID, (utterances) => utterances.length);

export const entityIDsByIntentID = createSelector(allByIntentID, (utterances) => utterances.map(({ text }) => getMarkupEntityIDs(text)));

export const entityIDsByIntentIDs = createSelector(intentIDsParamSelector, getAllByIntentID, (intentIDs, getIntentUtterances) =>
  intentIDs.flatMap((intentID) => getIntentUtterances({ intentID }).flatMap(({ text }) => getMarkupEntityIDs(text)))
);
