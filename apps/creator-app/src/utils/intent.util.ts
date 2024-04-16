import { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { QualityLevel } from '@voiceflow/ui-next/build/cjs/utils/quality-level.util';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

const BUILTIN_INTENT_ID_SET = new Set(
  [
    ...AlexaConstants.BUILT_IN_INTENTS,
    ...GoogleConstants.BUILT_IN_INTENTS,
    ...DFESConstants.BUILT_IN_INTENTS,
    ...Object.values(VoiceflowConstants.DEFAULT_INTENTS_MAP).flat(),
  ].map((intent) => intent.name)
);

export const isIntentBuiltIn = (intentID: string): boolean => BUILTIN_INTENT_ID_SET.has(intentID);

export const getIntentConfidenceProgress = (count: number) => {
  if (count < 4) return 6.25 * count;
  if (count < 7) return 7.4 * count;
  if (count < 10) return 8.33 * count;

  return 100;
};

export const getIntentConfidenceLevel = (count: number): QualityLevel => {
  if (count < 4) return 'low';
  if (count < 7) return 'ok';
  if (count < 10) return 'good';

  return 'great';
};

export const getIntentConfidenceMessage = (count: number): string => {
  if (count < 4) return 'Not enough sample phrases. Add more to increase accuracy.';
  if (count < 10) return 'Number of phrases is sufficient, but adding more will increase accuracy.';
  return 'Intent contains enough phrases to maintain a high level of accuracy.';
};

const removeBuiltInIntentNamePrefix = (name: string): string => (name.includes('.') ? name.split('.')[1] : name);

export const formatBuiltInIntentName = Realtime.Utils.platform.createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: (name: string) =>
      removeBuiltInIntentNamePrefix(name)
        .replace(/(\w)Intent/g, '$1')
        .replace(/([A-Za-z])([A-Z])(?=[a-z])/g, '$1 $2') // camelCase => camel Case
        .replace(/([a-z])([A-Z]{2})(?=[a-z])/g, '$1 $2') // camelCaseSH => camel Case SH
        .replace(/([a-z])([A-Z]+)(?=[A-Z])/g, '$1 $2') // camelCaseSHORT => camel Case SHORT
        .trim(),

    [Platform.Constants.PlatformType.GOOGLE]: (name: string) =>
      Utils.string.capitalizeFirstLetter(name.replace('actions.intent.', '').replace(/_/g, ' ').toLowerCase()),

    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: (name: string) =>
      name.startsWith('actions.intent.')
        ? Utils.string.capitalizeFirstLetter(name.replace('actions.intent.', '').replace(/_/g, ' ').toLowerCase())
        : Utils.string.capitalizeFirstLetter(removeBuiltInIntentNamePrefix(name).replace(/_/g, ' ').toLowerCase()),
  },
  (name: string) =>
    name === VoiceflowConstants.IntentName.NONE
      ? 'Fallback'
      : Utils.string.capitalizeFirstLetter(removeBuiltInIntentNamePrefix(name).replace(/_/g, ' ').toLowerCase())
);
