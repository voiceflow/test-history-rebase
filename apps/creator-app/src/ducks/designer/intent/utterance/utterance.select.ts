import { Utils } from '@voiceflow/common';
import { getMarkupEntityIDs } from '@voiceflow/utils-designer';
import { createSelector } from 'reselect';

import { createCurriedSelector, createSubSelector } from '@/ducks/utils';
import { sortCreatableCMSResources } from '@/utils/cms.util';
import { isUtteranceTextEmpty } from '@/utils/utterance.util';

import { createDesignerCRUDSelectors, intentIDParamSelector, intentIDsParamSelector } from '../../utils/selector.util';
import { root as intentRoot } from '../selectors/root.select';
import { STATE_KEY } from './utterance.state';

const root = createSubSelector(intentRoot, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const allByIntentID = createSelector(all, intentIDParamSelector, (utterances, intentID) =>
  !intentID ? [] : sortCreatableCMSResources(utterances.filter((utterance) => utterance.intentID === intentID))
);

export const getAllByIntentID = createCurriedSelector(allByIntentID);

export const countByIntentID = createSelector(allByIntentID, (utterances) => utterances.length);

export const nonEmptyCountByIntentID = createSelector(
  allByIntentID,
  (utterances) => utterances.filter((utterance) => !isUtteranceTextEmpty(utterance.text)).length
);

export const entityIDsByIntentID = createSelector(allByIntentID, (utterances) =>
  Utils.array.unique(utterances.flatMap(({ text }) => getMarkupEntityIDs(text)))
);

export const entityIDsByIntentIDs = createSelector(intentIDsParamSelector, getAllByIntentID, (intentIDs, getIntentUtterances) =>
  intentIDs.flatMap((intentID) => getIntentUtterances({ intentID }).flatMap(({ text }) => getMarkupEntityIDs(text)))
);
