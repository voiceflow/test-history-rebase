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
import { getPlatformIntentNameFormatter } from '@/platforms/selectors';

import { getBuiltInSynonyms } from '../slot';

export * from './platform';
export * from './utterance';

export const NEW_INTENT_NAME = 'intent';

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

export const getIntentNameLabel = (name = ''): string => INTENT_LABELS[name] ?? name;

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

export const removeBuiltInPrefix = (name: string): string => (name.includes('.') ? name.split('.')[1] : name);

const CONTAIN_INTENT_REGEXP = /(\w)Intent/g;
const CAMEL_CASE_REGEXPS = [
  /([A-Za-z])([A-Z])(?=[a-z])/g, // camelCase
  /([a-z])([A-Z]{2})(?=[a-z])/g, // camelCaseSH
  /([a-z])([A-Z]+)(?=[A-Z])/g, // camelCaseSHORT
];

const prettifyAlexaIntentName = (name = ''): string =>
  name
    .replace(CONTAIN_INTENT_REGEXP, '$1')
    .replace(CAMEL_CASE_REGEXPS[0], '$1 $2') // camelCase => camel Case
    .replace(CAMEL_CASE_REGEXPS[1], '$1 $2') // camelCaseSH => camel Case SH
    .replace(CAMEL_CASE_REGEXPS[2], '$1 $2') // camelCaseSHORT => camel Case SHORT
    .trim();

export const getTruncatedName = Realtime.Utils.platform.createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: (name: string) => prettifyAlexaIntentName(removeBuiltInPrefix(name)),

    [Platform.Constants.PlatformType.GOOGLE]: (name: string) =>
      Utils.string.capitalizeFirstLetter(name.replace('actions.intent.', '').replace(/_/g, ' ').toLowerCase()),

    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: (name: string) =>
      name.startsWith('actions.intent.')
        ? Utils.string.capitalizeFirstLetter(name.replace('actions.intent.', '').replace(/_/g, ' ').toLowerCase())
        : Utils.string.capitalizeFirstLetter(removeBuiltInPrefix(name).replace(/_/g, ' ').toLowerCase()),
  },
  (name: string) => Utils.string.capitalizeFirstLetter(removeBuiltInPrefix(name).replace(/_/g, ' ').toLowerCase())
);

export const fmtIntentName = (intent: Platform.Base.Models.Intent.Model, platform: Platform.Constants.PlatformType): string => {
  let { name } = intent ?? { name: '' };

  name = getIntentNameLabel(name);

  return isCustomizableBuiltInIntent(intent) ? getTruncatedName(platform)(name) : name;
};

export const platformIntentFactory =
  (platform: Platform.Constants.PlatformType) =>
  (intent: { name: string; slots?: string[] }): Platform.Base.Models.Intent.Model => ({
    id: intent.name,
    name: getTruncatedName(platform)(intent.name) ?? getIntentNameLabel(intent.name),
    slots: { byKey: {}, allKeys: [] },
    inputs: [{ text: '', slots: intent.slots ?? [] }],
  });

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

export const ALEXA_BUILT_INTENTS = AlexaConstants.BUILT_IN_INTENTS.map(platformIntentFactory(Platform.Constants.PlatformType.ALEXA));

export const GOOGLE_BUILT_INTENTS = GoogleConstants.BUILT_IN_INTENTS.map(platformIntentFactory(Platform.Constants.PlatformType.GOOGLE));

export const DIALOGFLOW_BUILT_INTENTS = DFESConstants.BUILT_IN_INTENTS.map(platformIntentFactory(Platform.Constants.PlatformType.DIALOGFLOW_ES));

export const VOICEFLOW_BUILT_INS_MAP = Object.keys(VoiceflowConstants.DEFAULT_INTENTS_MAP).reduce<
  Record<string, Platform.Base.Models.Intent.Model[]>
>(
  (acc, key) =>
    Object.assign(acc, { [key]: VoiceflowConstants.DEFAULT_INTENTS_MAP[key].map(platformIntentFactory(Platform.Constants.PlatformType.VOICEFLOW)) }),
  {}
);

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

export const removeSlotRefFromInput = (text: string, slotDetails: Realtime.Slot): string =>
  text.replace(SLOT_REGEXP, (match, inner) => (inner.match(slotDetails.name) ? slotDetails.name : match));

export const getIntentStrengthLevel = (count: number) => getIntentConfidenceStrengthLevel(count);

export const getIntentClarityStrengthLevel = (count: number) => {
  if (count === -1) return StrengthGauge.Level.LOADING;
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

  return {
    goToNodeID,
    goToIntent,
    goToDiagram,
    goToIntentName: goToIntent?.name ?? '',
  };
};

export const fillEntities = (
  utterances: string,
  {
    type,
    locales,
    slotsMap,
    platform,
  }: {
    type: Platform.Constants.ProjectType;
    locales: string[];
    slotsMap: Record<string, Realtime.Slot>;
    platform: Platform.Constants.PlatformType;
  }
) => {
  const projectConfig = Platform.Config.getTypeConfig({ type, platform });

  const locale =
    locales.find((l) => projectConfig.project.locale.utteranceRecommendations.includes(l)) ??
    projectConfig.project.locale.utteranceRecommendations[0];

  const voiceflowLocale = projectConfig.utils.locale.toVoiceflowLocale(locale);

  return utterances.replace(SLOT_REGEXP, (_match, name: string, id: string) => {
    const slot = slotsMap[id];
    const synonyms = slot?.inputs.flatMap((input) => [input.value, ...input.synonyms]) ?? [];
    const builtInSynonyms = getBuiltInSynonyms(slot.type ?? '', voiceflowLocale, platform) ?? [];

    return _sample([...synonyms, ...builtInSynonyms]) ?? name;
  });
};

export const isPromptEmpty = (prompt?: unknown): boolean => {
  if (!prompt) return true;

  if (Platform.Common.Voice.CONFIG.utils.intent.isPrompt(prompt)) {
    return Platform.Common.Voice.CONFIG.utils.intent.isPromptEmpty(prompt);
  }

  if (Platform.Common.Chat.CONFIG.utils.intent.isPrompt(prompt)) {
    return Platform.Common.Chat.CONFIG.utils.intent.isPromptEmpty(prompt);
  }

  return true;
};

export const isDefaultIntentName = (name?: string | null) => !name || name.toLowerCase().startsWith(NEW_INTENT_NAME);
