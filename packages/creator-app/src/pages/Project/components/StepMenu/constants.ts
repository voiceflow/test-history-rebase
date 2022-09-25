import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _isFunction from 'lodash/isFunction';

import { DragItem } from '@/constants';
import { getManager } from '@/pages/Canvas/managers/utils';

export interface StepItem {
  type: Realtime.BlockType;
  getIcon: (manager?: ReturnType<typeof getManager>) => any;
  getLabel: (manager?: ReturnType<typeof getManager>) => any;
  getStepTooltipText: (manager?: ReturnType<typeof getManager>) => string | undefined;
  getStepTooltipLink: (manager?: ReturnType<typeof getManager>) => string | undefined;
  publicOnly?: boolean;
  factoryData?: Realtime.NodeData<any>;
  tooltipText?: string;
  tooltipLink?: string;
}

export interface BaseTopStepItem {
  icon: SvgIconTypes.Icon;
  smallIcon?: SvgIconTypes.Icon;
  label: string;
  steps: unknown[];
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

export const isBlockTemplatesData = (_tabData: TabData, currentTab: LibraryStepType): _tabData is BaseModels.Version.CanvasTemplate => {
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

export const getStepIcon = ({ factoryData, manager }: StepProps) =>
  (_isFunction(manager.getIcon) && factoryData && manager.getIcon(factoryData)) || manager.icon!;

export const getStepLabel = ({ factoryData, manager }: StepProps) =>
  (_isFunction(manager.getDataLabel) && factoryData && manager.getDataLabel(factoryData)) || manager.label;

export const getStepTooltipText = ({ factoryData, manager }: StepProps) =>
  (_isFunction(manager.getTooltipText) && factoryData && manager.getTooltipText(factoryData)) || manager.tooltipText;

export const getStepTooltipLink = ({ manager }: StepProps) => manager.tooltipLink;

const createMenuStep = (type: Realtime.StepBlockType, { publicOnly, factoryData }: MenuStepsConfig = {}) => {
  return {
    type,
    publicOnly,
    factoryData,
    getIcon: (manager?: ReturnType<typeof getManager>) => getStepIcon({ factoryData, manager: manager || getManager(type) }),
    getLabel: (manager?: ReturnType<typeof getManager>) => getStepLabel({ factoryData, manager: manager || getManager(type) }),
    getStepTooltipText: (manager?: ReturnType<typeof getManager>) => getStepTooltipText({ factoryData, manager: manager || getManager(type) }),
    getStepTooltipLink: (manager?: ReturnType<typeof getManager>) => getStepTooltipLink({ manager: manager || getManager(type) }),
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

const DIRECTIVE_STEP = createMenuStep(Realtime.BlockType.DIRECTIVE);

const DISPLAY_STEP = createMenuStep(Realtime.BlockType.DISPLAY);

const EVENT_STEP = createMenuStep(Realtime.BlockType.EVENT);

const CONDITION_STEP_V2 = createMenuStep(Realtime.BlockType.IFV2);

const EXIT_STEP = createMenuStep(Realtime.BlockType.EXIT);

const COMPONENT_STEP = createMenuStep(Realtime.BlockType.COMPONENT);

const API_STEP = createMenuStep(Realtime.BlockType.INTEGRATION, { factoryData: { selectedIntegration: BaseNode.Utils.IntegrationType.CUSTOM_API } });

const INTENT_STEP = createMenuStep(Realtime.BlockType.INTENT);

const RANDOM_STEP_V2 = createMenuStep(Realtime.BlockType.RANDOMV2);

const SET_STEP_V2 = createMenuStep(Realtime.BlockType.SETV2);

const SPEAK_STEP = createMenuStep(Realtime.BlockType.SPEAK, { factoryData: { dialogs: [{ type: Realtime.DialogType.VOICE }] } });

const AUDIO_STEP = createMenuStep(Realtime.BlockType.SPEAK, { factoryData: { dialogs: [{ type: Realtime.DialogType.AUDIO }] } });

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

const LOGIC_ICON = 'systemLogic' as const;
const LOGIC_ICON_SMALL = 'ifV2' as const;
const LOGIC_LABEL = 'Logic';

const EVENT_ICON = 'systemEvent' as const;
export const EVENT_LABEL = 'Event';

const DEV_ICON = 'systemDev' as const;
const DEV_ICON_SMALL = 'systemDevSmall' as const;
const DEV_LABEL = 'Dev';

// alexa menu sections
export const ALEXA_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    smallIcon: TALK_ICON_SMALL,
    label: TALK_LABEL,
    steps: [SPEAK_STEP, AUDIO_STEP, DISPLAY_STEP, CARDV2_STEP, STREAM_STEP],
  },
  {
    icon: LISTEN_ICON,
    smallIcon: LISTEN_ICON_SMALL,
    label: LISTEN_LABEL,
    steps: [CHOICE_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    smallIcon: LOGIC_ICON_SMALL,
    label: LOGIC_LABEL,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    steps: [INTENT_STEP, EVENT_STEP],
  },
  {
    icon: DEV_ICON,
    smallIcon: DEV_ICON_SMALL,
    label: DEV_LABEL,
    steps: [API_STEP, CODE_STEP, TRACE_STEP, DIRECTIVE_STEP],
  },
];

// google menu sections
export const GOOGLE_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    smallIcon: TALK_ICON_SMALL,
    label: TALK_LABEL,
    steps: [SPEAK_STEP, AUDIO_STEP, CARDV2_STEP, STREAM_STEP],
  },
  {
    icon: LISTEN_ICON,
    smallIcon: LISTEN_ICON_SMALL,
    label: LISTEN_LABEL,
    steps: [CHOICE_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    smallIcon: LOGIC_ICON_SMALL,
    label: LOGIC_LABEL,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    steps: [INTENT_STEP],
  },
  {
    icon: DEV_ICON,
    smallIcon: DEV_ICON_SMALL,
    label: DEV_LABEL,
    steps: [API_STEP, CODE_STEP, TRACE_STEP, DIRECTIVE_STEP],
  },
];

// chatbot menu sections
export const CHATBOT_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    smallIcon: TALK_ICON_SMALL,
    label: TALK_LABEL,
    steps: [TEXT_STEP, VISUAL_STEP, CARDV2_STEP, CAROUSEL_STEP],
  },
  {
    icon: LISTEN_ICON,
    smallIcon: LISTEN_ICON_SMALL,
    label: LISTEN_LABEL,
    steps: [BUTTONS_STEP, CHOICE_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    smallIcon: LOGIC_ICON_SMALL,
    label: LOGIC_LABEL,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    steps: [INTENT_STEP],
  },
  {
    icon: DEV_ICON,
    smallIcon: DEV_ICON_SMALL,
    label: DEV_LABEL,
    steps: [API_STEP, CODE_STEP, TRACE_STEP],
  },
];

// general menu sections
export const GENERAL_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    smallIcon: TALK_ICON_SMALL,
    label: TALK_LABEL,
    steps: [SPEAK_STEP, AUDIO_STEP, VISUAL_STEP],
  },
  {
    icon: LISTEN_ICON,
    smallIcon: LISTEN_ICON_SMALL,
    label: LISTEN_LABEL,
    steps: [CHOICE_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    smallIcon: LOGIC_ICON_SMALL,
    label: LOGIC_LABEL,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    steps: [INTENT_STEP],
  },
  {
    icon: DEV_ICON,
    smallIcon: DEV_ICON_SMALL,
    label: DEV_LABEL,
    steps: [API_STEP, CODE_STEP, TRACE_STEP],
  },
];

// dialogflow chat menu sections
export const DIALOGFLOW_ES_CHAT_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    smallIcon: TALK_ICON_SMALL,
    label: TALK_LABEL,
    steps: [TEXT_STEP, VISUAL_STEP, CARDV2_STEP, CAROUSEL_STEP, CUSTOM_PAYLOAD_STEP],
  },
  {
    icon: LISTEN_ICON,
    smallIcon: LISTEN_ICON_SMALL,
    label: LISTEN_LABEL,
    steps: [BUTTONS_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    smallIcon: LOGIC_ICON_SMALL,
    label: LOGIC_LABEL,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    steps: [INTENT_STEP],
  },
  {
    icon: DEV_ICON,
    smallIcon: DEV_ICON_SMALL,
    label: DEV_LABEL,
    steps: [API_STEP, CODE_STEP, TRACE_STEP],
  },
];

// dialogflow voice menu sections
export const DIALOGFLOW_ES_VOICE_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    smallIcon: TALK_ICON_SMALL,
    label: TALK_LABEL,
    steps: [SPEAK_STEP, AUDIO_STEP, CUSTOM_PAYLOAD_STEP, CARDV2_STEP],
  },
  {
    icon: LISTEN_ICON,
    smallIcon: LISTEN_ICON_SMALL,
    label: LISTEN_LABEL,
    steps: [CHOICE_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    smallIcon: LOGIC_ICON_SMALL,
    label: LOGIC_LABEL,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    steps: [INTENT_STEP],
  },
  {
    icon: DEV_ICON,
    smallIcon: DEV_ICON_SMALL,
    label: DEV_LABEL,
    steps: [API_STEP, CODE_STEP, TRACE_STEP],
  },
];

export const getStepSections = Realtime.Utils.platform.createPlatformAndProjectTypeSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: ALEXA_STEP_SECTIONS,
    [VoiceflowConstants.PlatformType.GOOGLE]: GOOGLE_STEP_SECTIONS,
    [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.CHAT}`]: CHATBOT_STEP_SECTIONS,
    [`${VoiceflowConstants.PlatformType.DIALOGFLOW_ES}:${VoiceflowConstants.ProjectType.CHAT}`]: DIALOGFLOW_ES_CHAT_STEP_SECTIONS,
    [`${VoiceflowConstants.PlatformType.DIALOGFLOW_ES}:${VoiceflowConstants.ProjectType.VOICE}`]: DIALOGFLOW_ES_VOICE_STEP_SECTIONS,
    [VoiceflowConstants.ProjectType.CHAT]: CHATBOT_STEP_SECTIONS,
    [VoiceflowConstants.ProjectType.VOICE]: GENERAL_STEP_SECTIONS,
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

export const getAllSections = (platform: VoiceflowConstants.PlatformType, project: VoiceflowConstants.ProjectType, library: LibrarySections) => {
  const steps = getStepSections(platform, project);
  const librarySection = getLibrarySection(library);
  return [...steps, librarySection];
};
