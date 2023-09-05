import { createSelector } from 'reselect';

import { createSubSelector } from '@/ducks/utils';

import { createDesignerCRUDSelectors, intentIDParamSelector } from '../../utils';
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

export const countByIntentID = createSelector(allByIntentID, (utterances) => utterances.length);
