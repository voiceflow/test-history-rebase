import { Constants as AlexaConstants } from '@voiceflow/alexa-types';
import { SLOT_REGEXP } from '@voiceflow/common';
import { Constants, Constants as GeneralConstants } from '@voiceflow/general-types';
import { Constants as GoogleConstants } from '@voiceflow/google-types';

import { FILTERED_AMAZON_INTENTS } from '@/constants';
import {
  ChatIntent,
  ChatIntentSlot,
  ChatIntentSlotDialog,
  Intent,
  IntentSlot,
  IntentSlotDialog,
  PlatformIntent,
  Slot,
  VoiceIntent,
  VoiceIntentSlot,
} from '@/models';
import { Nullable, Nullish } from '@/types';
import { Normalized } from '@/utils/normalized';
import { capitalizeFirstLetter } from '@/utils/string';
import { isChatbotPlatform, isGeneralPlatform } from '@/utils/typeGuards';

import { createPlatformSelector } from './platform';

const AMAZON_INTENT_PREFIX = 'AMAZON.';

const amazonBuiltInIntentsArray = Object.values(AlexaConstants.AmazonIntent) as string[];
const generalBuiltInIntentsArray = Object.values(GeneralConstants.IntentName) as string[];
const builtInIntentMap = new Map([...amazonBuiltInIntentsArray, ...generalBuiltInIntentsArray].map((id) => [id, true]));

const intentLabel: { [key in GeneralConstants.IntentName]?: string } = {
  [GeneralConstants.IntentName.NONE]: 'Fallback',
};

export const isCustomizableBuiltInIntent = (intent?: Nullish<Intent>): boolean => !!intent && builtInIntentMap.has(intent.id);

export const formatIntentName = (name = ''): string =>
  name
    .replace(' ', '_')
    .replace(/[^A-Z_a-z]/g, '')
    .toLowerCase();

export const prettifyIntentName = (name = ''): string =>
  name
    .replace(/(\w)Intent/g, '$1')
    .replace(/([A-Za-z])([A-Z])(?=[a-z])/g, '$1 $2') // camelCase => camel Case
    .replace(/([a-z])([A-Z]{2})(?=[a-z])/g, '$1 $2') // camelCaseSH => camel Case SH
    .replace(/([a-z])([A-Z]+)(?=[A-Z])/g, '$1 $2') // camelCaseSHORT => camel Case SHORT
    .trim();

export const prettifyIntentNames = <T extends Intent>(intents: T[]): T[] =>
  intents.map((intent) => ({ ...intent, name: prettifyIntentName(intent.name) }));

export const applyIntentNameChanges = (name = ''): string => {
  return intentLabel[name as GeneralConstants.IntentName] ?? name;
};

export const applyIntentsNameChanges = <T extends Intent>(intents: T[]): T[] =>
  intents.map((intent) => ({ ...intent, name: applyIntentNameChanges(intent.name) }));

export const filterIntents = <T extends Intent>(intents: T[], activeIntent: T): T[] =>
  intents.filter((intent) => {
    const isActiveIntent = intent.id === activeIntent?.id;

    if (isActiveIntent) {
      return true;
    }

    if (isCustomizableBuiltInIntent(intent)) {
      return !FILTERED_AMAZON_INTENTS.includes(intent.name.replace(AMAZON_INTENT_PREFIX, ''));
    }

    return true;
  });

export const intentFactory =
  <T extends Constants.PlatformType>(platform: T) =>
  (intent: { name: string; slots?: string[] }): PlatformIntent<T> => {
    const truncatedName = intent.name.split('.')[1];

    return {
      id: intent.name,
      name: truncatedName ?? intent.name,
      slots: { byKey: {}, allKeys: [] },
      inputs: [{ text: '', slots: intent.slots ?? [] }],
      platform,
    };
  };

export const generalIntentFactory = (generalIntent: GeneralConstants.DefaultIntent): VoiceIntent => {
  const intent = intentFactory(Constants.PlatformType.GENERAL)(generalIntent);

  return {
    ...intent,
    name: capitalizeFirstLetter(generalIntent.samples[0] ?? intent.name),
  };
};

export const validateIntentName = (intentName: string, intents: Intent[], slots: Slot[]): Nullable<string> => {
  const lowerCasedIntentName = intentName.toLowerCase();

  if (intents.some(({ name }) => name.toLowerCase() === lowerCasedIntentName)) {
    return `The '${intentName}' intent already exists.`;
  }

  if (slots.some(({ name }) => name.toLowerCase() === lowerCasedIntentName)) {
    return `You have an entity defined with the '${intentName}' name already. Intent/entity name must be unique.`;
  }

  return null;
};

export const ALEXA_BUILT_INS = AlexaConstants.BUILT_IN_INTENTS.map(intentFactory(Constants.PlatformType.ALEXA));

export const GOOGLE_BUILT_INS = GoogleConstants.BUILT_IN_INTENTS.map(intentFactory(Constants.PlatformType.GOOGLE));

export const GENERAL_BUILT_INS_MAP = Object.keys(GeneralConstants.DEFAULT_INTENTS_MAP).reduce<Record<string, Intent[]>>(
  (acc, key) => Object.assign(acc, { [key]: GeneralConstants.DEFAULT_INTENTS_MAP[key].map(generalIntentFactory) }),
  {}
);

export const getBuiltInIntents = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: ALEXA_BUILT_INS,
    [Constants.PlatformType.GOOGLE]: GOOGLE_BUILT_INS,
  },
  GENERAL_BUILT_INS_MAP[GeneralConstants.Locale.EN_US]
);

export const isBuiltInIntent = (intentID: string): boolean => [...ALEXA_BUILT_INS, ...GOOGLE_BUILT_INS].some((intent) => intent.id === intentID);

const NUMERIC_UTTERANCE_REGEXP = /\d/;

export function validateUtterance(utterance: string, intentID: string, intents: Intent[]): string {
  const utteranceWithoutSlots = utterance.replace(SLOT_REGEXP, '');

  let err = '';

  if (utterance === '') {
    return 'Utterances must contain text';
  }

  if (utteranceWithoutSlots.match(NUMERIC_UTTERANCE_REGEXP)) {
    return 'Utterances cannot contain numbers, replace them with words or a slot that accepts numbers as a value.';
  }

  const lowercaseUtterance = utterance.toLowerCase();

  intents.some(({ inputs, id, name }) =>
    inputs.some(({ text }) => {
      if (text.toLowerCase() === lowercaseUtterance) {
        err =
          id === intentID ? 'You already have this utterance in this intent.' : `You already have this utterance defined in the "${name}" intent.`;

        return true;
      }

      return false;
    })
  );

  return err;
}

export const applyPlatformIntentNameFormatting = (name: string, platform: Constants.PlatformType) => {
  const hasNoRules = isGeneralPlatform(platform) || isChatbotPlatform(platform);
  if (hasNoRules) return name;
  return formatIntentName(name);
};

export const removeSlotRefFromInput = (text: string, slotDetails: Slot): string =>
  text.replace(SLOT_REGEXP, (match, inner) => (inner.match(slotDetails.name) ? slotDetails.name : match));

export const removeBuiltInPrefix = (name: string): string => (name.includes('.') ? name.split('.')[1] : name);

export const inferIntentType: {
  <T extends Intent['slots']>(intent: Omit<Intent, 'slots'> & { slots: T }): T extends Normalized<ChatIntentSlot> ? ChatIntent : VoiceIntent;
  <T extends Intent['slots']>(intent: Omit<Partial<Intent>, 'slots'> & { slots: T }): T extends Normalized<ChatIntentSlot>
    ? Partial<ChatIntent>
    : Partial<VoiceIntent>;
} = (intent: any): any => intent;

export const inferIntentSlotsType = <T extends IntentSlot>(slots: {
  byKey: Record<string, T>;
  allKeys: string[];
}): T extends Record<string, ChatIntentSlot> ? Normalized<ChatIntentSlot> : Normalized<VoiceIntentSlot> => slots as any;

export const inferIntentSlotType: {
  <T extends IntentSlotDialog>(slot: Omit<IntentSlotDialog, 'dialog'> & { dialog: T }): T extends ChatIntentSlotDialog
    ? ChatIntentSlot
    : VoiceIntentSlot;
  <T extends IntentSlotDialog>(slot: Omit<Partial<IntentSlotDialog>, 'dialog'> & { dialog: T }): T extends ChatIntentSlotDialog
    ? Partial<ChatIntentSlot>
    : Partial<VoiceIntentSlot>;
} = (slot: any): any => slot;
