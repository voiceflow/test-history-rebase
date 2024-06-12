import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';
// eslint-disable-next-line you-dont-need-lodash-underscore/is-function
import _isFunction from 'lodash/isFunction';

import { DragItem } from '@/constants';
import { getManager } from '@/pages/Canvas/managers/utils';

export interface StepItem {
  type: Realtime.BlockType;
  getIcon: (manager?: ReturnType<typeof getManager>) => SvgIconTypes.Icon;
  getLabel: (manager?: ReturnType<typeof getManager>) => string | undefined;
  getStepTooltipText: (manager?: ReturnType<typeof getManager>) => string | undefined;
  getStepTooltipLink: (manager?: ReturnType<typeof getManager>) => string | undefined;
  publicOnly?: boolean;
  factoryData?: Realtime.NodeData<any>;
  tooltipText?: string;
  tooltipLink?: string;
}

export interface BaseTopStepItem {
  icon?: SvgIconTypes.Icon;
  label: string;
  steps: unknown[];
  smallIcon?: SvgIconTypes.Icon;
}

export interface TopStepItem extends BaseTopStepItem {
  steps: StepItem[];
  isLibrary?: never;
}

export interface LibraryDragItem<T = unknown> {
  type: DragItem;
  libraryType: LibraryStepType;
  tabData: {
    name: string;
    id: string;
  } & T;
}

export type TabData = BaseModels.Version.CanvasTemplate | Realtime.CustomBlock;

export const isBlockTemplatesData = (
  _tabData: TabData,
  currentTab: LibraryStepType
): _tabData is BaseModels.Version.CanvasTemplate => {
  return currentTab === LibraryStepType.BLOCK_TEMPLATES;
};

export const isCustomBlockData = (_tabData: TabData, currentTab: LibraryStepType): _tabData is Realtime.CustomBlock => {
  return currentTab === LibraryStepType.CUSTOM_BLOCK;
};

export interface TopLibraryItem extends BaseTopStepItem {
  librarySections: {
    templates: BaseModels.Version.CanvasTemplate[];
    customBlocks: Realtime.CustomBlock[];
  };
  isLibrary: true;
}

interface StepProps {
  manager: ReturnType<typeof getManager>;
  factoryData?: Realtime.NodeData<any>;
}

interface MenuStepsConfig {
  publicOnly?: boolean;
  factoryData?: Realtime.NodeData<any>;
}

export const getStepIcon = ({ factoryData, manager }: StepProps): SvgIconTypes.Icon =>
  (_isFunction(manager.getIcon) && factoryData && manager.getIcon(factoryData)) || manager.icon!;

export const getStepLabel = ({ factoryData, manager }: StepProps): string | undefined =>
  (_isFunction(manager.getDataLabel) && factoryData && manager.getDataLabel(factoryData)) || manager.label;

export const getStepTooltipText = ({ factoryData, manager }: StepProps): string | undefined =>
  (_isFunction(manager.getTooltipText) && factoryData && manager.getTooltipText(factoryData)) || manager.tooltipText;

export const getStepTooltipLink = ({ factoryData, manager }: StepProps): string | undefined =>
  (_isFunction(manager.getTooptipLink) && factoryData && manager.getTooptipLink(factoryData)) || manager.tooltipLink;

const createMenuStep = (type: Realtime.StepBlockType, { publicOnly, factoryData }: MenuStepsConfig = {}) => {
  return {
    type,
    publicOnly,
    factoryData,
    getIcon: (manager?: ReturnType<typeof getManager>) =>
      getStepIcon({ factoryData, manager: manager || getManager(type) }),
    getLabel: (manager?: ReturnType<typeof getManager>) =>
      getStepLabel({ factoryData, manager: manager || getManager(type) }),
    getStepTooltipText: (manager?: ReturnType<typeof getManager>) =>
      getStepTooltipText({ factoryData, manager: manager || getManager(type) }),
    getStepTooltipLink: (manager?: ReturnType<typeof getManager>) =>
      getStepTooltipLink({ factoryData, manager: manager || getManager(type) }),
  };
};

// STEPS

const CAPTURE_STEP_V2 = createMenuStep(Realtime.BlockType.CAPTUREV2);

const CAROUSEL_STEP = createMenuStep(Realtime.BlockType.CAROUSEL);
const CARDV2_STEP = createMenuStep(Realtime.BlockType.CARDV2);

const CHOICE_STEP = createMenuStep(Realtime.BlockType.CHOICE);

const CUSTOM_PAYLOAD_STEP = createMenuStep(Realtime.BlockType.PAYLOAD);

const BUTTONS_STEP = createMenuStep(Realtime.BlockType.BUTTONS);

const CODE_STEP = createMenuStep(Realtime.BlockType.CODE);

const FUNCTION_STEP = createMenuStep(Realtime.BlockType.FUNCTION);

const RESPONSE_STEP = createMenuStep(Realtime.BlockType.RESPONSE);

const DIRECTIVE_STEP = createMenuStep(Realtime.BlockType.DIRECTIVE);

const DISPLAY_STEP = createMenuStep(Realtime.BlockType.DISPLAY);

const EVENT_STEP = createMenuStep(Realtime.BlockType.EVENT);

const CONDITION_STEP_V2 = createMenuStep(Realtime.BlockType.IFV2);

const EXIT_STEP = createMenuStep(Realtime.BlockType.EXIT);

const COMPONENT_STEP = createMenuStep(Realtime.BlockType.COMPONENT);

const API_STEP = createMenuStep(Realtime.BlockType.INTEGRATION);

const INTENT_STEP = createMenuStep(Realtime.BlockType.INTENT);

const RANDOM_STEP_V2 = createMenuStep(Realtime.BlockType.RANDOMV2);

const AI_RESPONSE_STEP = createMenuStep(Realtime.BlockType.AI_RESPONSE);

const AI_SET_STEP = createMenuStep(Realtime.BlockType.AI_SET);

const SET_STEP_V2 = createMenuStep(Realtime.BlockType.SETV2);

const SPEAK_STEP = createMenuStep(Realtime.BlockType.SPEAK, {
  factoryData: { dialogs: [{ type: Realtime.DialogType.VOICE }] },
});

const AUDIO_STEP = createMenuStep(Realtime.BlockType.SPEAK, {
  factoryData: { dialogs: [{ type: Realtime.DialogType.AUDIO }] },
});

const TEXT_STEP = createMenuStep(Realtime.BlockType.TEXT);

const STREAM_STEP = createMenuStep(Realtime.BlockType.STREAM);

const VISUAL_STEP = createMenuStep(Realtime.BlockType.VISUAL);

const TRACE_STEP = createMenuStep(Realtime.BlockType.TRACE);

/*
 Step Menu Sections
*/

const TALK_ICON = 'systemTalk' as const;
const TALK_ICON_SMALL = 'systemTalkSmall' as const;
const TALK_LABEL = 'Talk';

const LISTEN_ICON = 'systemListen' as const;
const LISTEN_ICON_SMALL = 'systemListenSmall' as const;
const LISTEN_LABEL = 'Listen';

const AI_ICON = 'logoOpenAI' as const;
const AI_ICON_SMALL = 'logoOpenAI' as const;
export const AI_LABEL = 'AI';

const LOGIC_ICON = 'systemLogic' as const;
const LOGIC_ICON_SMALL = 'ifV2' as const;
const LOGIC_LABEL = 'Logic';

const EVENT_ICON = 'systemEvent' as const;
export const EVENT_LABEL = 'Event';

const DEV_ICON = 'systemDev' as const;
const DEV_ICON_SMALL = 'systemDevSmall' as const;
const DEV_LABEL = 'Dev';

interface CreateStepSectionsArguments {
  aiSteps: StepItem[];
  talkSteps: StepItem[];
  listenSteps: StepItem[];
  logicSteps: StepItem[];
  eventSteps: StepItem[];
  devSteps: StepItem[];
}

const createStepSections = ({
  aiSteps,
  talkSteps,
  listenSteps,
  logicSteps,
  eventSteps,
  devSteps,
}: CreateStepSectionsArguments): TopStepItem[] => [
  {
    icon: AI_ICON,
    smallIcon: AI_ICON_SMALL,
    label: AI_LABEL,
    steps: aiSteps,
  },
  {
    icon: TALK_ICON,
    smallIcon: TALK_ICON_SMALL,
    label: TALK_LABEL,
    steps: talkSteps,
  },
  {
    icon: LISTEN_ICON,
    smallIcon: LISTEN_ICON_SMALL,
    label: LISTEN_LABEL,
    steps: listenSteps,
  },
  {
    icon: LOGIC_ICON,
    smallIcon: LOGIC_ICON_SMALL,
    label: LOGIC_LABEL,
    steps: logicSteps,
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    steps: eventSteps,
  },
  {
    icon: DEV_ICON,
    smallIcon: DEV_ICON_SMALL,
    label: DEV_LABEL,
    steps: devSteps,
  },
];

// alexa menu sections
export const ALEXA_STEP_SECTIONS = createStepSections({
  aiSteps: [AI_RESPONSE_STEP, AI_SET_STEP],
  talkSteps: [SPEAK_STEP, AUDIO_STEP, DISPLAY_STEP, CARDV2_STEP, STREAM_STEP],
  listenSteps: [CHOICE_STEP, CAPTURE_STEP_V2],
  logicSteps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  eventSteps: [INTENT_STEP, EVENT_STEP],
  devSteps: [FUNCTION_STEP, API_STEP, CODE_STEP, TRACE_STEP, DIRECTIVE_STEP],
});

// google menu sections
export const GOOGLE_STEP_SECTIONS = createStepSections({
  aiSteps: [AI_RESPONSE_STEP, AI_SET_STEP],
  talkSteps: [SPEAK_STEP, AUDIO_STEP, CARDV2_STEP, STREAM_STEP],
  listenSteps: [CHOICE_STEP, CAPTURE_STEP_V2],
  logicSteps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  eventSteps: [INTENT_STEP],
  devSteps: [FUNCTION_STEP, API_STEP, CODE_STEP, TRACE_STEP, DIRECTIVE_STEP],
});

// chatbot menu sections
export const CHATBOT_STEP_SECTIONS = createStepSections({
  aiSteps: [AI_RESPONSE_STEP, AI_SET_STEP],
  talkSteps: [RESPONSE_STEP, TEXT_STEP, VISUAL_STEP, CARDV2_STEP, CAROUSEL_STEP],
  listenSteps: [BUTTONS_STEP, CHOICE_STEP, CAPTURE_STEP_V2],
  logicSteps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  eventSteps: [INTENT_STEP],
  devSteps: [FUNCTION_STEP, API_STEP, CODE_STEP, TRACE_STEP],
});

// general menu sections
export const GENERAL_STEP_SECTIONS = createStepSections({
  aiSteps: [AI_RESPONSE_STEP, AI_SET_STEP],
  talkSteps: [SPEAK_STEP, AUDIO_STEP, VISUAL_STEP],
  listenSteps: [CHOICE_STEP, CAPTURE_STEP_V2],
  logicSteps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  eventSteps: [INTENT_STEP],
  devSteps: [FUNCTION_STEP, API_STEP, CODE_STEP, TRACE_STEP],
});

// dialogflow chat menu sections
export const DIALOGFLOW_ES_CHAT_STEP_SECTIONS = createStepSections({
  aiSteps: [AI_RESPONSE_STEP, AI_SET_STEP],
  talkSteps: [RESPONSE_STEP, TEXT_STEP, VISUAL_STEP, CARDV2_STEP, CAROUSEL_STEP, CUSTOM_PAYLOAD_STEP],
  listenSteps: [CHOICE_STEP, BUTTONS_STEP, CAPTURE_STEP_V2],
  logicSteps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  eventSteps: [INTENT_STEP],
  devSteps: [FUNCTION_STEP, API_STEP, CODE_STEP, TRACE_STEP],
});

// dialogflow voice menu sections
export const DIALOGFLOW_ES_VOICE_STEP_SECTIONS = createStepSections({
  aiSteps: [AI_RESPONSE_STEP, AI_SET_STEP],
  talkSteps: [SPEAK_STEP, AUDIO_STEP, CUSTOM_PAYLOAD_STEP, CARDV2_STEP],
  listenSteps: [CHOICE_STEP, CAPTURE_STEP_V2],
  logicSteps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  eventSteps: [INTENT_STEP],
  devSteps: [FUNCTION_STEP, API_STEP, CODE_STEP, TRACE_STEP],
});

export const MICROSOFT_TEAMS_STEP_SECTIONS = createStepSections({
  aiSteps: [AI_RESPONSE_STEP, AI_SET_STEP],
  talkSteps: [RESPONSE_STEP, TEXT_STEP, VISUAL_STEP, CARDV2_STEP],
  listenSteps: [BUTTONS_STEP, CHOICE_STEP, CAPTURE_STEP_V2],
  logicSteps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  eventSteps: [INTENT_STEP],
  devSteps: [FUNCTION_STEP, API_STEP, CODE_STEP],
});

export const WHATSAPP_STEP_SECTIONS = createStepSections({
  aiSteps: [AI_RESPONSE_STEP, AI_SET_STEP],
  talkSteps: [RESPONSE_STEP, TEXT_STEP, VISUAL_STEP],
  listenSteps: [CHOICE_STEP, CAPTURE_STEP_V2],
  logicSteps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  eventSteps: [INTENT_STEP],
  devSteps: [FUNCTION_STEP, API_STEP, CODE_STEP],
});

export const SMS_STEP_SECTIONS = createStepSections({
  aiSteps: [AI_RESPONSE_STEP, AI_SET_STEP],
  talkSteps: [RESPONSE_STEP, TEXT_STEP, VISUAL_STEP],
  listenSteps: [CHOICE_STEP, CAPTURE_STEP_V2],
  logicSteps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  eventSteps: [INTENT_STEP],
  devSteps: [FUNCTION_STEP, API_STEP, CODE_STEP],
});

export const getStepSections = Realtime.Utils.platform.createPlatformAndProjectTypeSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: ALEXA_STEP_SECTIONS,
    [Platform.Constants.PlatformType.GOOGLE]: GOOGLE_STEP_SECTIONS,
    [`${Platform.Constants.PlatformType.VOICEFLOW}:${Platform.Constants.ProjectType.CHAT}`]: CHATBOT_STEP_SECTIONS,
    [`${Platform.Constants.PlatformType.DIALOGFLOW_ES}:${Platform.Constants.ProjectType.CHAT}`]:
      DIALOGFLOW_ES_CHAT_STEP_SECTIONS,
    [`${Platform.Constants.PlatformType.DIALOGFLOW_ES}:${Platform.Constants.ProjectType.VOICE}`]:
      DIALOGFLOW_ES_VOICE_STEP_SECTIONS,
    [Platform.Constants.PlatformType.MICROSOFT_TEAMS]: MICROSOFT_TEAMS_STEP_SECTIONS,
    [Platform.Constants.PlatformType.WHATSAPP]: WHATSAPP_STEP_SECTIONS,
    [Platform.Constants.PlatformType.SMS]: SMS_STEP_SECTIONS,
    [Platform.Constants.ProjectType.CHAT]: CHATBOT_STEP_SECTIONS,
    [Platform.Constants.ProjectType.VOICE]: GENERAL_STEP_SECTIONS,
  },
  GENERAL_STEP_SECTIONS
);

export interface LibrarySections {
  [LibraryStepType.CUSTOM_BLOCK]: Realtime.CustomBlock[];
  [LibraryStepType.BLOCK_TEMPLATES]: BaseModels.Version.CanvasTemplate[];
}

export const getLibrarySection = (library: LibrarySections): TopLibraryItem => {
  return {
    icon: 'library',
    smallIcon: 'librarySmall',
    label: 'Library',
    steps: [] /* dummy value */,
    librarySections: {
      templates: library[LibraryStepType.BLOCK_TEMPLATES],
      customBlocks: library[LibraryStepType.CUSTOM_BLOCK],
    },
    isLibrary: true,
  };
};

export enum LibraryStepType {
  CUSTOM_BLOCK = 'CUSTOM_BLOCK',
  BLOCK_TEMPLATES = 'BLOCK_TEMPLATES',
}

export const getAllSections = (
  platform: Platform.Constants.PlatformType,
  project: Platform.Constants.ProjectType,
  library: LibrarySections
) => {
  const steps = getStepSections(platform, project);
  const librarySection = getLibrarySection(library);

  return [...steps, librarySection];
};
