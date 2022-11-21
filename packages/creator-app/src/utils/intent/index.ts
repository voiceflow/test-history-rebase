import { AlexaConstants } from '@voiceflow/alexa-types';
import { BaseButton, BaseModels } from '@voiceflow/base-types';
import { Nullable, Nullish, SLOT_REGEXP, Utils } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { StrengthGauge } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _sample from 'lodash/sample';

import { FILTERED_AMAZON_INTENTS } from '@/constants';
import { getPlatformIntentNameFormatter, getUtteranceRecommendationsLocales } from '@/platforms/selectors';

import { getBuiltInSynonyms } from '../slot';

export * from './platform';
export * from './utterance';

const AMAZON_INTENT_PREFIX = 'AMAZON.';

const amazonBuiltInIntentsArray = Object.values(AlexaConstants.AmazonIntent) as string[];
const generalBuiltInIntentsArray = Object.values(VoiceflowConstants.IntentName) as string[];
const googleBuiltInIntentsArray = (Object.values(GoogleConstants.GoogleIntent) as string[]).concat(
  Object.values(GoogleConstants.GoogleStatusIntent)
) as string[];
const dialogflowESBuiltInIntentsArray = Object.values(DFESConstants.DialogflowESIntent) as string[];
const builtInIntentMap = new Map(
  [...amazonBuiltInIntentsArray, ...generalBuiltInIntentsArray, ...googleBuiltInIntentsArray, ...dialogflowESBuiltInIntentsArray].map((id) => [
    id,
    true,
  ])
);

const INTENT_LABELS: Partial<Record<string, string>> = {
  [VoiceflowConstants.IntentName.NONE]: 'Fallback',
};

export const isCustomizableBuiltInIntent = (intent?: Nullish<Platform.Base.Models.Intent.Model>): boolean =>
  !!intent && builtInIntentMap.has(intent.id);

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

export const prettifyIntentNames = <T extends Platform.Base.Models.Intent.Model>(intents: T[]): T[] =>
  intents.map((intent) => ({ ...intent, name: prettifyIntentName(intent.name) }));

export const getIntentNameLabel = (name = ''): string => INTENT_LABELS[name] ?? name;

export const fmtIntentName = (intent: Platform.Base.Models.Intent.Model, platform: Platform.Constants.PlatformType): string => {
  let { name } = intent ?? { name: '' };

  name = getIntentNameLabel(name);

  return isCustomizableBuiltInIntent(intent) ? applyCustomizableBuiltInIntent(name, platform) : name;
};

export const intentFilter = (
  intent: Platform.Base.Models.Intent.Model,
  activeIntent: Platform.Base.Models.Intent.Model | null = null,
  config: { noBuiltIns?: boolean } = {}
): boolean => {
  if (config.noBuiltIns) return !isCustomizableBuiltInIntent(intent);

  if (intent.id === activeIntent?.id) return true;

  if (isCustomizableBuiltInIntent(intent)) {
    return !FILTERED_AMAZON_INTENTS.includes(intent.name.replace(AMAZON_INTENT_PREFIX, ''));
  }

  return true;
};

export const getTruncatedName = Realtime.Utils.platform.createPlatformSelector(
  {
    [Platform.Constants.PlatformType.GOOGLE]: (name: string) =>
      Utils.string.capitalizeFirstLetter(name.replace('actions.intent.', '')?.toLowerCase()).replace(/_/g, ' '),
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: (name: string) =>
      Utils.string.capitalizeFirstLetter(name.replace('actions.intent.', '')?.toLowerCase()).replace(/_/g, ' '),
  },
  (name: string) => name.split('.')[1]
);

export const intentFactory =
  (platform: Platform.Constants.PlatformType) =>
  (intent: { name: string; slots?: string[] }): Platform.Base.Models.Intent.Model => {
    const truncatedName = getTruncatedName(platform)(intent.name);

    return {
      id: intent.name,
      name: truncatedName ?? getIntentNameLabel(intent.name),
      slots: { byKey: {}, allKeys: [] },
      inputs: [{ text: '', slots: intent.slots ?? [] }],
    };
  };

export const voiceflowIntentFactory = (generalIntent: VoiceflowConstants.DefaultIntent): Platform.Base.Models.Intent.Model => {
  const intent = intentFactory(Platform.Constants.PlatformType.VOICEFLOW)(generalIntent);

  return {
    ...intent,
    name: Utils.string.capitalizeFirstLetter(generalIntent.samples[0] ?? intent.name),
  };
};

export const validateIntentName = (
  intentName: string,
  intents: Platform.Base.Models.Intent.Model[],
  slots: Realtime.Slot[],
  platform: Platform.Constants.PlatformType
): Nullable<string> => {
  const lowerCasedIntentName = intentName.toLowerCase();

  if (intents.some((intent) => fmtIntentName(intent, platform).toLowerCase() === lowerCasedIntentName)) {
    return `The '${intentName}' intent already exists.`;
  }

  if (slots.some(({ name }) => name.toLowerCase() === lowerCasedIntentName)) {
    return `You have an entity defined with the '${intentName}' name already. Intent/entity name must be unique.`;
  }

  return null;
};

export const ALEXA_BUILT_INTENTS = AlexaConstants.BUILT_IN_INTENTS.map(intentFactory(Platform.Constants.PlatformType.ALEXA));

export const GOOGLE_BUILT_INTENTS = GoogleConstants.BUILT_IN_INTENTS.map(intentFactory(Platform.Constants.PlatformType.GOOGLE));

export const DIALOGFLOW_BUILT_INTENTS = DFESConstants.BUILT_IN_INTENTS.map(intentFactory(Platform.Constants.PlatformType.DIALOGFLOW_ES));

export const VOICEFLOW_BUILT_INS_MAP = Object.keys(VoiceflowConstants.DEFAULT_INTENTS_MAP).reduce<
  Record<string, Platform.Base.Models.Intent.Model[]>
>((acc, key) => Object.assign(acc, { [key]: VoiceflowConstants.DEFAULT_INTENTS_MAP[key].map(voiceflowIntentFactory) }), {});

export const getBuiltInIntents = Realtime.Utils.platform.createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: ALEXA_BUILT_INTENTS,
    [Platform.Constants.PlatformType.GOOGLE]: GOOGLE_BUILT_INTENTS,
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: DIALOGFLOW_BUILT_INTENTS,
  },
  VOICEFLOW_BUILT_INS_MAP[VoiceflowConstants.Language.EN]
);

export const isBuiltInIntent = (intentID: string): boolean =>
  [...ALEXA_BUILT_INTENTS, ...GOOGLE_BUILT_INTENTS, ...DIALOGFLOW_BUILT_INTENTS, ...VOICEFLOW_BUILT_INS_MAP[VoiceflowConstants.Language.EN]].some(
    (intent) => intent.id === intentID
  );

export const applyPlatformIntentNameFormatting = (name: string, platform: Platform.Constants.PlatformType): string =>
  getPlatformIntentNameFormatter(platform)(name);

export const applyCustomizableBuiltInIntent = (name: string, platform: Platform.Constants.PlatformType): string => {
  if (Realtime.Utils.typeGuards.isVoiceflowPlatform(platform)) {
    return Utils.string.capitalizeFirstLetter(removeBuiltInPrefix(name.toLowerCase()));
  }

  if (Realtime.Utils.typeGuards.isAlexaPlatform(platform)) {
    return removeBuiltInPrefix(name.replace(/(\w)Intent/g, '$1'));
  }

  if (Realtime.Utils.typeGuards.isGooglePlatform(platform)) {
    return Utils.string.capitalizeFirstLetter(name.replace('actions.intent.', '')?.toLowerCase()).replace(/_/g, ' ');
  }

  if (Realtime.Utils.typeGuards.isDialogflowPlatform(platform)) {
    if (name.startsWith('actions.intent.'))
      return Utils.string.capitalizeFirstLetter(name.replace('actions.intent.', '')?.toLowerCase()).replace(/_/g, ' ');

    return Utils.string.capitalizeFirstLetter(removeBuiltInPrefix(name.toLowerCase()));
  }

  return removeBuiltInPrefix(name);
};

export const removeSlotRefFromInput = (text: string, slotDetails: Realtime.Slot): string =>
  text.replace(SLOT_REGEXP, (match, inner) => (inner.match(slotDetails.name) ? slotDetails.name : match));

export const removeBuiltInPrefix = (name: string): string => (name.includes('.') ? name.split('.')[1] : name);

export const getIntentStrengthLevel = (count: number) => getIntentConfidenceStrengthLevel(count);

export const getIntentClarityStrengthLevel = (count: number) => {
  if (count === 0) return StrengthGauge.Level.NOT_SET;
  if (count < 0.4) return StrengthGauge.Level.WEAK;
  if (count < 0.7) return StrengthGauge.Level.MEDIUM;
  if (count < 1) return StrengthGauge.Level.STRONG;
  if (count === 1) return StrengthGauge.Level.VERY_STRONG;

  return StrengthGauge.Level.NOT_SET;
};

export const getIntentConfidenceStrengthLevel = (count: number) => {
  if (count === 0) return StrengthGauge.Level.NOT_SET;
  if (count < 4) return StrengthGauge.Level.WEAK;
  if (count < 7) return StrengthGauge.Level.MEDIUM;
  if (count < 10) return StrengthGauge.Level.STRONG;
  if (count >= 10) return StrengthGauge.Level.VERY_STRONG;

  return StrengthGauge.Level.NOT_SET;
};

export const intentButtonFactory = (): BaseButton.IntentButton => ({ name: '', type: BaseButton.ButtonType.INTENT, payload: { intentID: null } });

export const getGoToIntentMeta = ({
  intentID,
  diagramID,
  intentsMap,
  diagramMap,
  activeDiagramType,
  globalIntentStepMap,
  intentNodeDataLookup,
}: {
  intentID?: Nullable<string>;
  diagramID?: Nullable<string>;
  intentsMap: Record<string, Platform.Base.Models.Intent.Model>;
  diagramMap: Record<string, Realtime.Diagram>;
  activeDiagramType: BaseModels.Diagram.DiagramType;
  globalIntentStepMap: Record<string, Record<string, string[]>>;
  intentNodeDataLookup: Record<string, { data: Realtime.NodeData.Intent.PlatformData; intent: Platform.Base.Models.Intent.Model; nodeID: string }>;
}) => {
  const goToIntent = intentID ? intentsMap[intentID] ?? null : null;
  const goToDiagram = diagramID ? diagramMap[diagramID] ?? null : null;

  const topicGoToNodeID = goToIntent && goToDiagram ? globalIntentStepMap[goToDiagram.id]?.[goToIntent.id]?.[0] ?? null : null;
  const componentGoToNodeID = topicGoToNodeID || (goToIntent ? intentNodeDataLookup[goToIntent.id]?.nodeID ?? null : null);

  const isComponentDiagram = activeDiagramType === BaseModels.Diagram.DiagramType.COMPONENT;

  const goToNodeID = isComponentDiagram ? componentGoToNodeID : topicGoToNodeID;
  const goToIntentName = prettifyIntentName(goToIntent?.name);

  return {
    goToNodeID,
    goToIntent,
    goToDiagram,
    goToIntentName,
  };
};

export const fillEntities = (
  utterances: string,
  { slotsMap, locales, platform }: { slotsMap: Record<string, Realtime.Slot>; locales: string[]; platform: Platform.Constants.PlatformType }
) => {
  const supportedLocale = getUtteranceRecommendationsLocales(platform);
  const locale = locales.find((l) => supportedLocale.includes(l)) ?? supportedLocale[0];

  return utterances.replace(SLOT_REGEXP, (_match, name: string, id: string) => {
    const slot = slotsMap[id];
    const synonyms = slot?.inputs.flatMap((input) => [input.value, ...input.synonyms]) ?? [];
    const builtInSynonyms = getBuiltInSynonyms(slot.type ?? '', locale, platform) ?? [];

    return _sample([...synonyms, ...builtInSynonyms]) ?? name;
  });
};
