import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import uniqBy from 'lodash/uniqBy';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import * as Feature from '@/ducks/feature';
import * as IntentSelectorsV1 from '@/ducks/intent/selectors';
import { applyIntentNameFormatting } from '@/ducks/intent/utils';
import * as ProjectV2 from '@/ducks/projectV2';
import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors, idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import * as VersionV2 from '@/ducks/versionV2';
import { GENERAL_BUILT_INS_MAP, getBuiltInIntents } from '@/utils/intent';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

import { STATE_KEY } from './constants';

const {
  all: _allIntentsSelector,
  allIDs: _allIntentIDsSelector,
  byID: _intentByIDSelector,
  byIDs: _intentsByIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const allIntentIDsSelector = Feature.createAtomicActionsSelector([IntentSelectorsV1.allIntentIDsSelector, _allIntentIDsSelector]);

export const allIntentsSelector = Feature.createAtomicActionsSelector([IntentSelectorsV1.allIntentsSelector, _allIntentsSelector]);

export const intentByIDSelector = Feature.createAtomicActionsSelector(
  [IntentSelectorsV1.intentByIDSelector, _intentByIDSelector, idParamSelector],
  (getIntentV1, intentV2, intentID) => [intentID ? getIntentV1(intentID) : null, intentV2]
);

export const getIntentByIDSelector = createCurriedSelector(intentByIDSelector);

export const intentsByIDsSelector = Feature.createAtomicActionsSelector(
  [IntentSelectorsV1.intentsByIDsSelector, _intentsByIDsSelector, idsParamSelector],
  (getIntentsV1, intentsV2, intentIDs) => [getIntentsV1(intentIDs), intentsV2]
);

// platform-formatted

export const allCustomIntentsSelector = createSelector([allIntentsSelector, ProjectV2.active.platformSelector], (intents, platform) =>
  applyIntentNameFormatting(platform, intents)
);

export const customIntentMapSelector = createSelector([allCustomIntentsSelector], (intents) =>
  intents.reduce<Record<string, Realtime.Intent>>((acc, intent) => Object.assign(acc, { [intent.id]: intent }), {})
);

// This appends the built-in intent consts to the redux intents
export const allPlatformIntentsSelector = createSelector(
  [allCustomIntentsSelector, ProjectV2.active.platformSelector, VersionV2.active.localesSelector],
  (prettifiedIntents, platform, locales) => {
    if (isAnyGeneralPlatform(platform)) {
      const lang = (locales[0] ?? VoiceflowConstants.Locale.EN_US).split('-')[0];

      return uniqBy([...prettifiedIntents, ...(GENERAL_BUILT_INS_MAP[lang] || GENERAL_BUILT_INS_MAP.en)], (intent) => intent.id);
    }

    return uniqBy([...prettifiedIntents, ...getBuiltInIntents(platform)], (intent) => intent.id);
  }
);

export const platformIntentMapSelector = createSelector([allPlatformIntentsSelector], (intents) =>
  intents.reduce<Record<string, Realtime.Intent>>((acc, intent) => Object.assign(acc, { [intent.id]: intent }), {})
);

export const platformIntentByIDSelector = createSelector([platformIntentMapSelector, idParamSelector], (intentMap, id) =>
  id && Utils.object.hasProperty(intentMap, id) ? intentMap[id] : null
);

export const getPlatformIntentByIDSelector = createCurriedSelector(platformIntentByIDSelector);

// slots

export const getIntentSlotByIntentIDSlotIDSelector = createSelector(
  [getIntentByIDSelector],
  (getIntentByID) => (intentID: string, slotID: string) => {
    const intent = getIntentByID({ id: intentID });

    return intent?.slots.byKey[slotID] ?? null;
  }
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

export const slotsByIntentIDSelector = createSelector([intentByIDSelector], (intent): string[] => {
  const { inputs = [] } = intent ?? {};

  return Utils.array.unique(inputs.flatMap(({ slots }) => slots ?? '')).filter(Boolean);
});

export const allSlotsIDsByIntentIDsSelector = createSelector(
  [createCurriedSelector(slotsByIntentIDSelector), idsParamSelector],
  (getSlotIDsByIntentID, intentIDs) => Utils.array.unique(intentIDs.flatMap((intentID) => getSlotIDsByIntentID({ id: intentID })))
);
