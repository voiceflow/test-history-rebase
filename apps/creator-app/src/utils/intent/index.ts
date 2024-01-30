import { AlexaConstants } from '@voiceflow/alexa-types';
import { BaseButton, BaseModels } from '@voiceflow/base-types';
import { Nullable, Nullish } from '@voiceflow/common';
import { Entity, Intent } from '@voiceflow/dtos';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { StrengthGauge } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { FILTERED_AMAZON_INTENTS } from '@/constants';
import { getPlatformIntentNameFormatter } from '@/platforms/selectors';

import { formatBuiltInIntentName } from '../intent.util';

export * from './platform';

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

export const isCustomizableBuiltInIntent = (intent?: Nullish<Platform.Base.Models.Intent.Model | Intent>): boolean =>
  !!intent && builtInIntentMap.has(intent.id);

export const getIntentNameLabel = (name = ''): string => INTENT_LABELS[name] ?? name;

export const intentFilter = (
  intent: Platform.Base.Models.Intent.Model | Intent,
  activeIntent: Platform.Base.Models.Intent.Model | Intent | null = null,
  config: { noBuiltIns?: boolean } = {}
): boolean => {
  if (config.noBuiltIns) return !isCustomizableBuiltInIntent(intent);

  if (intent.id === activeIntent?.id) return true;

  if (isCustomizableBuiltInIntent(intent)) {
    return !FILTERED_AMAZON_INTENTS.includes(intent.name.replace(AMAZON_INTENT_PREFIX, ''));
  }

  return true;
};

const fmtIntentName = (intent: Platform.Base.Models.Intent.Model | Intent, platform: Platform.Constants.PlatformType): string => {
  let { name } = intent ?? { name: '' };

  name = getIntentNameLabel(name);

  return isCustomizableBuiltInIntent(intent) ? formatBuiltInIntentName(platform)(name) : name;
};

export const platformIntentFactory =
  (platform: Platform.Constants.PlatformType) =>
  (intent: { name: string; slots?: string[] }): Platform.Base.Models.Intent.Model => ({
    id: intent.name,
    name: formatBuiltInIntentName(platform)(intent.name) ?? getIntentNameLabel(intent.name),
    slots: { byKey: {}, allKeys: [] },
    inputs: [{ text: '', slots: intent.slots ?? [] }],
  });

export const validateIntentName = (
  intentName: string,
  intents: Array<Platform.Base.Models.Intent.Model | Intent>,
  entities: Array<Realtime.Slot | Entity>,
  platform: Platform.Constants.PlatformType
): Nullable<string> => {
  const lowerCasedIntentName = intentName.toLowerCase();

  if (intents.some((intent) => fmtIntentName(intent, platform).toLowerCase() === lowerCasedIntentName)) {
    return `The '${intentName}' intent already exists.`;
  }

  if (entities.some(({ name }) => name.toLowerCase() === lowerCasedIntentName)) {
    return `Intent name already exists.`;
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

export const applyPlatformIntentNameFormatting = (name: string, platform: Platform.Constants.PlatformType): string =>
  getPlatformIntentNameFormatter(platform)(name);

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
  intentsMap: Record<string, Platform.Base.Models.Intent.Model | Intent>;
  diagramMap: Record<string, Realtime.Diagram>;
  activeDiagramType: BaseModels.Diagram.DiagramType;
  globalIntentStepMap: Record<string, Record<string, string[]>>;
  intentNodeDataLookup: Record<
    string,
    { data: Realtime.NodeData.Intent.PlatformData; intent: Platform.Base.Models.Intent.Model | Intent; nodeID: string }
  >;
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

export const isDefaultIntentName = (name?: string | null) => !name || name.toLowerCase().startsWith('intent');
