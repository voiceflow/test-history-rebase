import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import uniqBy from 'lodash/uniqBy';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { platformSelector } from '@/ducks/projectV2/selectors/active';
import { createCurriedSelector, createParameterSelector } from '@/ducks/utils';
import { createCRUDSelectors, idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import { localesSelector } from '@/ducks/versionV2/selectors/active';
import { applyIntentNameFormatting, getBuiltInIntents, VOICEFLOW_BUILT_INS_MAP } from '@/utils/intent';

import { STATE_KEY } from './constants';

export const {
  all: allIntentsSelector,
  map: intentsMapSelector,
  byID: intentByIDSelector,
  byIDs: intentsByIDsSelector,
  allIDs: allIntentIDsSelector,
  getByID: getIntentByIDSelector,
} = createCRUDSelectors(STATE_KEY);

// platform-formatted

export const allCustomIntentsSelector = createSelector([allIntentsSelector, platformSelector], (intents, platform) =>
  applyIntentNameFormatting(platform, intents)
);

export const customIntentMapSelector = createSelector([allCustomIntentsSelector], (intents) =>
  intents.reduce<Record<string, Platform.Base.Models.Intent.Model>>((acc, intent) => Object.assign(acc, { [intent.id]: intent }), {})
);

// This appends the built-in intents to the redux intents
export const allPlatformIntentsSelector = createSelector(
  [allCustomIntentsSelector, platformSelector, localesSelector],
  (prettifiedIntents, platform, locales) => {
    if (Platform.Config.get(platform).isVoiceflowBased) {
      const lang = (locales[0] ?? VoiceflowConstants.Locale.EN_US).split('-')[0];

      return uniqBy([...prettifiedIntents, ...(VOICEFLOW_BUILT_INS_MAP[lang] || VOICEFLOW_BUILT_INS_MAP.en)], (intent) => intent.id);
    }

    return uniqBy([...prettifiedIntents, ...getBuiltInIntents(platform)], (intent) => intent.id);
  }
);

export const intentMapByNameSelector = createSelector([allPlatformIntentsSelector], (intents) =>
  intents.reduce<Record<string, Platform.Base.Models.Intent.Model>>((acc, intent) => Object.assign(acc, { [intent.name]: intent }), {})
);

export const platformIntentMapSelector = createSelector([allPlatformIntentsSelector], (intents) =>
  intents.reduce<Record<string, Platform.Base.Models.Intent.Model>>((acc, intent) => Object.assign(acc, { [intent.id]: intent }), {})
);

export const platformIntentByIDSelector = createSelector([platformIntentMapSelector, idParamSelector], (intentMap, id) =>
  id && Utils.object.hasProperty(intentMap, id) ? intentMap[id] : null
);

export const getPlatformIntentByIDSelector = createCurriedSelector(platformIntentByIDSelector);

// slots

const slotIDParamSelector = createParameterSelector((params: { slotID: string }) => params.slotID);

export const intentSlotByIntentIDSlotIDSelector = createSelector(
  [intentByIDSelector, slotIDParamSelector],
  (intent, slotID) => intent?.slots.byKey[slotID] ?? null
);

export const intentsUsingSlotSelector = createSelector([allIntentsSelector, idParamSelector], (intents, slotID) =>
  slotID
    ? intents.reduce<typeof intents>((acc, intent) => {
        if (Normal.hasOne(intent.slots, slotID)) {
          acc.push(intent);
        }

        return acc;
      }, [])
    : []
);

export const getIntentsUsingSlotSelector = createCurriedSelector(intentsUsingSlotSelector);

export const inputsByIntentIDSelector = createSelector([intentByIDSelector], (intent) => intent?.inputs ?? null);

export const slotsByIntentIDSelector = createSelector([inputsByIntentIDSelector], (inputs): string[] =>
  inputs ? Utils.array.unique(inputs.flatMap(({ slots }) => slots ?? '')).filter(Boolean) : []
);

export const allSlotsIDsByIntentIDsSelector = createSelector(
  [createCurriedSelector(slotsByIntentIDSelector), idsParamSelector],
  (getSlotIDsByIntentID, intentIDs) => Utils.array.unique(intentIDs.flatMap((intentID) => getSlotIDsByIntentID({ id: intentID })))
);
