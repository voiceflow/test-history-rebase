import { AlexaConstants } from '@voiceflow/alexa-types';
import { Nullable, Nullish, SLOT_REGEXP, Utils } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { Normalized } from 'normal-store';

import { FILTERED_AMAZON_INTENTS } from '@/constants';

import { createPlatformSelector } from './platform';

const AMAZON_INTENT_PREFIX = 'AMAZON.';

const amazonBuiltInIntentsArray = Object.values(AlexaConstants.AmazonIntent) as string[];
const generalBuiltInIntentsArray = Object.values(VoiceflowConstants.IntentName) as string[];
const builtInIntentMap = new Map([...amazonBuiltInIntentsArray, ...generalBuiltInIntentsArray].map((id) => [id, true]));

const INTENT_LABELS: Partial<Record<string, string>> = {
  [VoiceflowConstants.IntentName.NONE]: 'Fallback',
};

export const isCustomizableBuiltInIntent = (intent?: Nullish<Realtime.Intent>): boolean => !!intent && builtInIntentMap.has(intent.id);

export const formatIntentAndSlotName = (name = ''): string =>
  name
    .replace(' ', '_')
    .replace(/[^A-Z_a-z]/g, '')
    .toLowerCase();

const CONTAIN_INTENT_REGEXP = /(\w)Intent/g;
const CAMEL_CASE_REGEXPS = [
  /([A-Za-z])([A-Z])(?=[a-z])/g, // camelCase
  /([a-z])([A-Z]{2})(?=[a-z])/g, // camelCaseSH
  /([a-z])([A-Z]+)(?=[A-Z])/g, // camelCaseSHORT
];

export const prettifyIntentName = (name = ''): string =>
  name
    .replace(CONTAIN_INTENT_REGEXP, '$1')
    .replace(CAMEL_CASE_REGEXPS[0], '$1 $2') // camelCase => camel Case
    .replace(CAMEL_CASE_REGEXPS[1], '$1 $2') // camelCaseSH => camel Case SH
    .replace(CAMEL_CASE_REGEXPS[2], '$1 $2') // camelCaseSHORT => camel Case SHORT
    .trim();

export const prettifyIntentNames = <T extends Realtime.Intent>(intents: T[]): T[] =>
  intents.map((intent) => ({ ...intent, name: prettifyIntentName(intent.name) }));

export const getIntentNameLabel = (name = ''): string => INTENT_LABELS[name] ?? name;

export const intentFilter = <T extends Realtime.Intent>(intent: T, activeIntent: T | null = null, config: { noBuiltIns?: boolean } = {}): boolean => {
  const { noBuiltIns } = config;
  const isActiveIntent = intent.id === activeIntent?.id;
  if (noBuiltIns) {
    return !isCustomizableBuiltInIntent(intent);
  }

  if (isActiveIntent) {
    return true;
  }

  if (isCustomizableBuiltInIntent(intent)) {
    return !FILTERED_AMAZON_INTENTS.includes(intent.name.replace(AMAZON_INTENT_PREFIX, ''));
  }

  return true;
};

export const filterIntents = <T extends Realtime.Intent>(intents: T[], activeIntent?: T | null): T[] =>
  intents.filter((intent) => intentFilter(intent, activeIntent));

export const intentFactory =
  <T extends VoiceflowConstants.PlatformType>(platform: T) =>
  (intent: { name: string; slots?: string[] }): Realtime.PlatformIntent<T> => {
    const truncatedName = intent.name.split('.')[1];

    return {
      id: intent.name,
      name: truncatedName ?? getIntentNameLabel(intent.name),
      slots: { byKey: {}, allKeys: [] } as Realtime.PlatformIntent<T>['slots'],
      inputs: [{ text: '', slots: intent.slots ?? [] }],
      platform,
    } as Realtime.PlatformIntent<T>;
  };

export const generalIntentFactory = (generalIntent: VoiceflowConstants.DefaultIntent): Realtime.VoiceIntent => {
  const intent = intentFactory(VoiceflowConstants.PlatformType.GENERAL)(generalIntent);

  return {
    ...intent,
    name: Utils.string.capitalizeFirstLetter(generalIntent.samples[0] ?? intent.name),
  };
};

export const validateIntentName = (intentName: string, intents: Realtime.Intent[], slots: Realtime.Slot[]): Nullable<string> => {
  const lowerCasedIntentName = intentName.toLowerCase();

  if (intents.some(({ name }) => name.toLowerCase() === lowerCasedIntentName)) {
    return `The '${intentName}' intent already exists.`;
  }

  if (slots.some(({ name }) => name.toLowerCase() === lowerCasedIntentName)) {
    return `You have an entity defined with the '${intentName}' name already. Intent/entity name must be unique.`;
  }

  return null;
};

export const ALEXA_BUILT_INS = AlexaConstants.BUILT_IN_INTENTS.map(intentFactory(VoiceflowConstants.PlatformType.ALEXA));

export const GOOGLE_BUILT_INS = GoogleConstants.BUILT_IN_INTENTS.map(intentFactory(VoiceflowConstants.PlatformType.GOOGLE));

export const DIALOGFLOW_CHAT_BUILT_INS = DFESConstants.BUILT_IN_INTENTS.map(intentFactory(VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT));

export const DIALOGFLOW_VOICE_BUILT_INS = DFESConstants.BUILT_IN_INTENTS.map(intentFactory(VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE));

export const GENERAL_BUILT_INS_MAP = Object.keys(VoiceflowConstants.DEFAULT_INTENTS_MAP).reduce<Record<string, Realtime.Intent[]>>(
  (acc, key) => Object.assign(acc, { [key]: VoiceflowConstants.DEFAULT_INTENTS_MAP[key].map(generalIntentFactory) }),
  {}
);

export const getBuiltInIntents = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: ALEXA_BUILT_INS,
    [VoiceflowConstants.PlatformType.GOOGLE]: GOOGLE_BUILT_INS,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: DIALOGFLOW_CHAT_BUILT_INS,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: DIALOGFLOW_VOICE_BUILT_INS,
  },
  GENERAL_BUILT_INS_MAP[VoiceflowConstants.Locale.EN_US]
);

export const isBuiltInIntent = (intentID: string): boolean =>
  [...ALEXA_BUILT_INS, ...GOOGLE_BUILT_INS, ...DIALOGFLOW_CHAT_BUILT_INS, ...DIALOGFLOW_VOICE_BUILT_INS].some((intent) => intent.id === intentID);

const NUMERIC_UTTERANCE_REGEXP = /\d/;

export function validateUtterance(utterance: string, intentID: string | null, intents: Realtime.Intent[]): string {
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

export const applyPlatformIntentNameFormatting = (name: string, platform: VoiceflowConstants.PlatformType): string => {
  const hasNoRules = Realtime.Utils.typeGuards.isAnyGeneralPlatform(platform) || Realtime.Utils.typeGuards.isDialogflowPlatform(platform);

  if (hasNoRules) return name;

  return formatIntentAndSlotName(name);
};

export const applyCustomizableBuiltInIntent = (name: string, platform: VoiceflowConstants.PlatformType): string => {
  let newName = removeBuiltInPrefix(name);

  if (Realtime.Utils.typeGuards.isAnyGeneralPlatform(platform)) {
    newName = Utils.string.capitalizeFirstLetter(newName?.toLowerCase());
  } else if (Realtime.Utils.typeGuards.isAlexaPlatform(platform)) {
    newName = newName.replace(/(\w)Intent/g, '$1');
  }

  return newName;
};

export const removeSlotRefFromInput = (text: string, slotDetails: Realtime.Slot): string =>
  text.replace(SLOT_REGEXP, (match, inner) => (inner.match(slotDetails.name) ? slotDetails.name : match));

export const removeBuiltInPrefix = (name: string): string => (name.includes('.') ? name.split('.')[1] : name);

export const inferIntentType: {
  <T extends Realtime.Intent['slots']>(intent: Omit<Realtime.Intent, 'slots'> & { slots: T }): T extends Normalized<Realtime.ChatIntentSlot>
    ? Realtime.ChatIntent
    : Realtime.VoiceIntent;
  <T extends Realtime.Intent['slots']>(intent: Omit<Partial<Realtime.Intent>, 'slots'> & { slots: T }): T extends Normalized<Realtime.ChatIntentSlot>
    ? Partial<Realtime.ChatIntent>
    : Partial<Realtime.VoiceIntent>;
} = (intent: any): any => intent;

export const inferIntentSlotsType = <T extends Realtime.IntentSlot>(slots: {
  byKey: Record<string, T>;
  allKeys: string[];
}): T extends Record<string, Realtime.ChatIntentSlot> ? Normalized<Realtime.ChatIntentSlot> : Normalized<Realtime.VoiceIntentSlot> => slots as any;

export const inferIntentSlotType: {
  <T extends Realtime.IntentSlotDialog>(slot: Omit<Realtime.IntentSlotDialog, 'dialog'> & { dialog: T }): T extends Realtime.ChatIntentSlotDialog
    ? Realtime.ChatIntentSlot
    : Realtime.VoiceIntentSlot;
  <T extends Realtime.IntentSlotDialog>(
    slot: Omit<Partial<Realtime.IntentSlotDialog>, 'dialog'> & { dialog: T }
  ): T extends Realtime.ChatIntentSlotDialog ? Partial<Realtime.ChatIntentSlot> : Partial<Realtime.VoiceIntentSlot>;
} = (slot: any): any => slot;
