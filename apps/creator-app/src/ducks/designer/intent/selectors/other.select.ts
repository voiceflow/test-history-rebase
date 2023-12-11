import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createSelector } from 'reselect';

import { platformSelector } from '@/ducks/projectV2/selectors/active/base';
import { createCurriedSelector } from '@/ducks/utils';
import { idParamSelector } from '@/ducks/utils/crudV2';
import { formatBuiltInIntentName, isIntentBuiltIn } from '@/utils/intent.util';

import { createByFolderIDSelectors } from '../../utils/selector.util';
import { getAllByIntentID as getAllUtterancesByIntentID } from '../utterance/utterance.select';
import { all } from './crud.select';

export const allWithFormattedBuiltInNames = createSelector(all, platformSelector, (intents, platform) =>
  intents.map((intent) => (isIntentBuiltIn(intent.id) ? { ...intent, name: formatBuiltInIntentName(platform)(intent.name) } : intent))
);

export const mapWithFormattedBuiltInName = createSelector(allWithFormattedBuiltInNames, (intents) =>
  Utils.array.createMap(intents, (intent) => intent.id)
);

export const oneWithFormattedBuiltNameByID = createSelector(mapWithFormattedBuiltInName, idParamSelector, (map, id) =>
  id != null ? map[id] ?? null : null
);

export const getOneWithFormattedBuiltNameByID = createCurriedSelector(oneWithFormattedBuiltNameByID);

export const allWithUtterances = createSelector(allWithFormattedBuiltInNames, getAllUtterancesByIntentID, (entities, getUtterances) =>
  entities.map((intent) => ({ ...intent, utterances: getUtterances({ intentID: intent.id }) }))
);

export const oneWithUtterances = createSelector(
  oneWithFormattedBuiltNameByID,
  getAllUtterancesByIntentID,
  (intent, getUtterances) => intent && { ...intent, utterances: getUtterances({ intentID: intent.id }) }
);

export const getOneWithUtterances = createCurriedSelector(oneWithUtterances);

export const nameByID = createSelector(oneWithFormattedBuiltNameByID, (intent) => intent?.name ?? null);

export const automaticRepromptByID = createSelector(oneWithFormattedBuiltNameByID, (intent) => intent?.automaticReprompt ?? null);

export const allWithoutFallback = createSelector(allWithFormattedBuiltInNames, (intents) =>
  intents.filter((intent) => intent.id !== VoiceflowConstants.IntentName.NONE)
);

export const countWithoutFallback = createSelector(allWithoutFallback, (intents) => intents.length);

export const { allByFolderID, countByFolderID } = createByFolderIDSelectors(allWithoutFallback);
