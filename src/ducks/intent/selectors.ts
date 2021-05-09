import { Locale as GeneralLocale } from '@voiceflow/general-types';
import uniqBy from 'lodash/uniqBy';
import { createSelector } from 'reselect';

import { PlatformType } from '@/constants';
import { applyIntentNameFormatting } from '@/ducks/intent/utils';
import { activeLocalesSelector, activePlatformSelector } from '@/ducks/skill/skill/selectors';
import { createCRUDSelectors } from '@/ducks/utils/crud';
import { Intent } from '@/models';
import { unique } from '@/utils/array';
import { BUILT_IN_INTENTS, GENERAL_BUILT_INS_MAP } from '@/utils/intent';

import { STATE_KEY } from './constants';

export const {
  root: rootIntentsSelector,
  map: mapIntentsSelector,
  all: allIntentsSelector,
  byID: intentByIDSelector,
  findByIDs: intentsByIDsSelector,
  has: hasIntentsSelector,
} = createCRUDSelectors(STATE_KEY);

export const allIntentIDsSelector = createSelector([allIntentsSelector], (intents) => intents.map(({ id }) => id));

export const allSlotsByIntentIDSelector = createSelector([intentByIDSelector], (getIntentByID) => (id: string): string[] => {
  const intent = getIntentByID(id);

  return !intent ? [] : unique(intent.inputs.flatMap(({ slots }) => slots ?? '')).filter((s) => !!s);
});

// This appends the builtIn intent consts to the redux intents
export const allPlatformIntentsSelector = createSelector(
  [allIntentsSelector, activePlatformSelector, activeLocalesSelector],
  (intents, platform, locales) => {
    const prettifiedIntents = applyIntentNameFormatting(intents, platform);

    if (platform === PlatformType.GENERAL) {
      const lang = (locales[0] ?? GeneralLocale.EN_US).split('-')[0];

      return uniqBy([...prettifiedIntents, ...(GENERAL_BUILT_INS_MAP[lang] || GENERAL_BUILT_INS_MAP.en)], (intent) => intent.id);
    }

    return uniqBy([...prettifiedIntents, ...BUILT_IN_INTENTS[platform]], (intent) => intent.id);
  }
);

export const allCustomIntentsSelector = createSelector([allIntentsSelector, activePlatformSelector], (intents, platform) =>
  applyIntentNameFormatting(intents, platform)
);

export const mapPlatformIntentsSelector = createSelector([allPlatformIntentsSelector], (intents) =>
  intents.reduce<Record<string, Intent>>((acc, intent) => Object.assign(acc, { [intent.id]: intent }), {})
);

export const mapCustomIntentsSelector = createSelector([allCustomIntentsSelector], (intents) =>
  intents.reduce<Record<string, Intent>>((acc, intent) => Object.assign(acc, { [intent.id]: intent }), {})
);

export const platformIntentByIDSelector = createSelector([mapPlatformIntentsSelector], (intentsMap) => (id: string) => intentsMap[id]);

export const allSlotsIDsByIntentIDsSelector = createSelector([allSlotsByIntentIDSelector], (getSlotIDsByIntentID) => (intentIDs: string[]) =>
  Array.from(
    intentIDs.reduce<Set<string>>((acc, intentID) => {
      getSlotIDsByIntentID(intentID).forEach((slotID) => acc.add(slotID));

      return acc;
    }, new Set())
  )
);

export const intentSlotByIntentIDSlotIDSelector = createSelector([intentByIDSelector], (getIntentByID) => (intentID: string, slotID: string) => {
  const intent = getIntentByID(intentID);

  return intent.slots.byKey[slotID];
});
