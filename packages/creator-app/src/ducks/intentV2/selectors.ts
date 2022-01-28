import { Utils } from '@voiceflow/common';
import { Constants as GeneralConstants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import uniqBy from 'lodash/uniqBy';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import * as DiagramV2 from '@/ducks/diagramV2';
import * as Feature from '@/ducks/feature';
import * as IntentSelectorsV1 from '@/ducks/intent/selectors';
import { applyIntentNameFormatting } from '@/ducks/intent/utils';
import * as ProjectV2 from '@/ducks/projectV2';
import { createCRUDSelectors, idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import * as VersionV2 from '@/ducks/versionV2';
import { GENERAL_BUILT_INS_MAP, getBuiltInIntents } from '@/utils/intent';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

import { STATE_KEY } from './constants';

const {
  all: _allIntentsSelector,
  allIDs: _allIntentIDsSelector,
  byID: _intentByIDSelector,
  getByID: _getIntentByIDSelector,
  byIDs: _intentsByIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const allIntentIDsSelector = Feature.createAtomicActionsSelector([IntentSelectorsV1.allIntentIDsSelector, _allIntentIDsSelector]);

export const allIntentsSelector = Feature.createAtomicActionsSelector([IntentSelectorsV1.allIntentsSelector, _allIntentsSelector]);

export const intentByIDSelector = Feature.createAtomicActionsSelector(
  [IntentSelectorsV1.intentByIDSelector, _intentByIDSelector, idParamSelector],
  (getIntentV1, intentV2, intentID) => [intentID ? getIntentV1(intentID) : null, intentV2]
);

export const getIntentByIDSelector = Feature.createAtomicActionsSelector([IntentSelectorsV1.intentByIDSelector, _getIntentByIDSelector]);

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
      const lang = (locales[0] ?? GeneralConstants.Locale.EN_US).split('-')[0];

      return uniqBy([...prettifiedIntents, ...(GENERAL_BUILT_INS_MAP[lang] || GENERAL_BUILT_INS_MAP.en)], (intent) => intent.id);
    }

    return uniqBy([...prettifiedIntents, ...getBuiltInIntents(platform)], (intent) => intent.id);
  }
);

export const platformIntentMapSelector = createSelector([allPlatformIntentsSelector], (intents) =>
  intents.reduce<Record<string, Realtime.Intent>>((acc, intent) => Object.assign(acc, { [intent.id]: intent }), {})
);

export const getPlatformIntentByIDSelector = createSelector(
  [platformIntentMapSelector],
  (intentMap) => (id: string) => Utils.object.hasProperty(intentMap, id) ? intentMap[id] : null
);

// slots

export const intentSlotByIntentIDSlotIDSelector = createSelector([getIntentByIDSelector], (getIntentByID) => (intentID: string, slotID: string) => {
  const intent = getIntentByID(intentID);

  return intent?.slots.byKey[slotID] ?? null;
});

export const intentsUsingSlotSelector = createSelector(
  [allIntentsSelector],
  (intents) => (slotID: string) =>
    intents.reduce<typeof intents>((acc, intent) => {
      if (Normal.hasOne(intent.slots, slotID)) {
        acc.push(intent);
      }

      return acc;
    }, [])
);

export const getSlotsByIntentIDSelector = createSelector([getIntentByIDSelector], (getIntentByID) => (id: string): string[] => {
  const intent = getIntentByID(id);
  if (!intent) return [];

  return Utils.array.unique(intent.inputs.flatMap(({ slots }) => slots ?? '')).filter(Boolean);
});

export const allSlotsIDsByIntentIDsSelector = createSelector([getSlotsByIntentIDSelector, idsParamSelector], (getSlotIDsByIntentID, intentIDs) =>
  Utils.array.unique(intentIDs.flatMap(getSlotIDsByIntentID))
);

export const openIntentsSelector = createSelector([allPlatformIntentsSelector, DiagramV2.intentStepsSelector], (intents, intentSteps) => {
  const uniqIntentIDs = Utils.array.unique(Object.values(intentSteps).flatMap((stepIntentMap) => Object.values(stepIntentMap)));
  const openIntentIDsMap = uniqIntentIDs.reduce<Record<string, boolean>>((acc, intentID) => Object.assign(acc, { [intentID ?? '']: true }), {});

  return intents.filter((intent) => openIntentIDsMap[intent.id]);
});
