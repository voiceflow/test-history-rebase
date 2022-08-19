import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _isFunction from 'lodash/isFunction';

import { BlockCategory } from '@/constants';
import { getManager } from '@/pages/Canvas/managers/utils';

export interface MenuStep {
  type: Realtime.BlockType;
  icon: SvgIconTypes.Icon;
  label: string;
  publicOnly?: boolean;
  factoryData?: Realtime.NodeData<any>;
}

interface StepProps {
  factoryData?: Realtime.NodeData<any>;
  manager: ReturnType<typeof getManager>;
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

const ACCOUNT_LINKING_STEP = createMenuStep(Realtime.BlockType.ACCOUNT_LINKING);

const CANCEL_PURCHASE_STEP = createMenuStep(Realtime.BlockType.CANCEL_PAYMENT);

const CAPTURE_STEP_V2 = createMenuStep(Realtime.BlockType.CAPTUREV2);

const CARD_STEP = createMenuStep(Realtime.BlockType.CARD);
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

const GOOGLE_SHEETS_STEP = createMenuStep(Realtime.BlockType.INTEGRATION, {
  publicOnly: true,
  factoryData: { selectedIntegration: BaseNode.Utils.IntegrationType.GOOGLE_SHEETS },
});

const INTENT_STEP = createMenuStep(Realtime.BlockType.INTENT);

const PURCHASE_STEP = createMenuStep(Realtime.BlockType.PAYMENT);

const PERMISSIONS_STEP = createMenuStep(Realtime.BlockType.PERMISSION);

const PROMPT_STEP = createMenuStep(Realtime.BlockType.PROMPT);

const RANDOM_STEP_V2 = createMenuStep(Realtime.BlockType.RANDOMV2);

const REMINDER_STEP = createMenuStep(Realtime.BlockType.REMINDER);

const SET_STEP_V2 = createMenuStep(Realtime.BlockType.SETV2);

const SPEAK_STEP = createMenuStep(Realtime.BlockType.SPEAK, { factoryData: { dialogs: [{ type: Realtime.DialogType.VOICE }] } });

const AUDIO_STEP = createMenuStep(Realtime.BlockType.SPEAK, { factoryData: { dialogs: [{ type: Realtime.DialogType.AUDIO }] } });

const TEXT_STEP = createMenuStep(Realtime.BlockType.TEXT);

const STREAM_STEP = createMenuStep(Realtime.BlockType.STREAM);

const USER_INFO_STEP = createMenuStep(Realtime.BlockType.USER_INFO);

const VISUAL_STEP = createMenuStep(Realtime.BlockType.VISUAL);

const TRACE_STEP = createMenuStep(Realtime.BlockType.TRACE);

// alexa menu sections
export const ALEXA_SECTIONS = [
  {
    type: BlockCategory.RESPONSE,
    label: 'Response',
    steps: [SPEAK_STEP, AUDIO_STEP, DISPLAY_STEP, CARD_STEP, STREAM_STEP],
  },
  {
    type: BlockCategory.USER_INPUT,
    label: 'User Input',
    steps: [CHOICE_STEP, CAPTURE_STEP_V2, PROMPT_STEP, INTENT_STEP, EVENT_STEP],
  },
  {
    type: BlockCategory.LOGIC,
    label: 'Logic',
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    type: BlockCategory.INTEGRATION,
    label: 'Integration',
    steps: [API_STEP, GOOGLE_SHEETS_STEP, CODE_STEP, TRACE_STEP],
  },
  {
    type: BlockCategory.CHANNEL,
    label: 'Channel',
    steps: [PURCHASE_STEP, CANCEL_PURCHASE_STEP, REMINDER_STEP, USER_INFO_STEP, PERMISSIONS_STEP, ACCOUNT_LINKING_STEP, DIRECTIVE_STEP],
  },
];

// google menu sections
export const GOOGLE_SECTIONS = [
  {
    type: BlockCategory.RESPONSE,
    label: 'Response',
    steps: [SPEAK_STEP, AUDIO_STEP, CARD_STEP, STREAM_STEP],
  },
  {
    type: BlockCategory.USER_INPUT,
    label: 'User Input',
    steps: [CHOICE_STEP, CAPTURE_STEP_V2, PROMPT_STEP, INTENT_STEP],
  },
  {
    type: BlockCategory.LOGIC,
    label: 'Logic',
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    type: BlockCategory.INTEGRATION,
    label: 'Integration',
    steps: [API_STEP, GOOGLE_SHEETS_STEP, CODE_STEP, TRACE_STEP],
  },
  {
    type: BlockCategory.CHANNEL,
    label: 'Channel',
    steps: [DIRECTIVE_STEP],
  },
];

// chatbot menu sections
export const CHATBOT_SECTIONS = [
  {
    type: BlockCategory.RESPONSE,
    label: 'Response',
    steps: [TEXT_STEP, VISUAL_STEP, CARDV2_STEP, CAROUSEL_STEP],
  },
  {
    type: BlockCategory.USER_INPUT,
    label: 'User Input',
    steps: [BUTTONS_STEP, CAPTURE_STEP_V2, PROMPT_STEP, INTENT_STEP],
  },
  {
    type: BlockCategory.LOGIC,
    label: 'Logic',
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    type: BlockCategory.INTEGRATION,
    label: 'Integration',
    steps: [API_STEP, GOOGLE_SHEETS_STEP, CODE_STEP, TRACE_STEP],
  },
];

// general menu sections
export const GENERAL_SECTIONS = [
  {
    type: BlockCategory.RESPONSE,
    label: 'Response',
    steps: [SPEAK_STEP, AUDIO_STEP, VISUAL_STEP],
  },
  {
    type: BlockCategory.USER_INPUT,
    label: 'User Input',
    steps: [CHOICE_STEP, CAPTURE_STEP_V2, PROMPT_STEP, INTENT_STEP],
  },
  {
    type: BlockCategory.LOGIC,
    label: 'Logic',
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    type: BlockCategory.INTEGRATION,
    label: 'Integration',
    steps: [API_STEP, GOOGLE_SHEETS_STEP, CODE_STEP, TRACE_STEP],
  },
];

// dialogflow chat menu sections
export const DIALOGFLOW_ES_CHAT_SECTIONS = [
  {
    type: BlockCategory.RESPONSE,
    label: 'Response',
    steps: [TEXT_STEP, VISUAL_STEP, CARD_STEP, CAROUSEL_STEP],
  },
  {
    type: BlockCategory.USER_INPUT,
    label: 'User Input',
    steps: [BUTTONS_STEP, CAPTURE_STEP_V2, PROMPT_STEP, INTENT_STEP],
  },
  {
    type: BlockCategory.LOGIC,
    label: 'Logic',
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    type: BlockCategory.INTEGRATION,
    label: 'Integration',
    steps: [CUSTOM_PAYLOAD_STEP, API_STEP, GOOGLE_SHEETS_STEP, CODE_STEP, TRACE_STEP],
  },
];

// dialogflow voice menu sections
export const DIALOGFLOW_ES_VOICE_SECTIONS = [
  {
    type: BlockCategory.RESPONSE,
    label: 'Response',
    steps: [SPEAK_STEP, AUDIO_STEP],
  },
  {
    type: BlockCategory.USER_INPUT,
    label: 'User Input',
    steps: [CHOICE_STEP, CAPTURE_STEP_V2, PROMPT_STEP, INTENT_STEP],
  },
  {
    type: BlockCategory.LOGIC,
    label: 'Logic',
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    type: BlockCategory.INTEGRATION,
    label: 'Integration',
    steps: [CUSTOM_PAYLOAD_STEP, API_STEP, GOOGLE_SHEETS_STEP, CODE_STEP, TRACE_STEP],
  },
];

export const getSections = Realtime.Utils.platform.createPlatformAndProjectTypeSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: ALEXA_SECTIONS,
    [VoiceflowConstants.PlatformType.GOOGLE]: GOOGLE_SECTIONS,
    [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.CHAT}`]: CHATBOT_SECTIONS,
    [`${VoiceflowConstants.PlatformType.DIALOGFLOW_ES}:${VoiceflowConstants.ProjectType.CHAT}`]: DIALOGFLOW_ES_CHAT_SECTIONS,
    [`${VoiceflowConstants.PlatformType.DIALOGFLOW_ES}:${VoiceflowConstants.ProjectType.VOICE}`]: DIALOGFLOW_ES_VOICE_SECTIONS,
    [VoiceflowConstants.ProjectType.CHAT]: CHATBOT_SECTIONS,
    [VoiceflowConstants.ProjectType.VOICE]: GENERAL_SECTIONS,
  },
  GENERAL_SECTIONS
);

/*
 Step Menu Sections
*/
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

export interface TopStepItem {
  icon: SvgIconTypes.Icon;
  label: string;
  steps: StepItem[];
  isLibrary: boolean;
}

const TALK_ICON = 'systemTalk' as const;
const TALK_LABEL = 'Talk';

const LISTEN_ICON = 'systemListen' as const;
const LISTEN_LABEL = 'Listen';

const LOGIC_ICON = 'systemLogic' as const;
const LOGIC_LABEL = 'Logic';

const EVENT_ICON = 'systemEvent' as const;
const EVENT_LABEL = 'Event';

const DEV_ICON = 'systemDev' as const;
const DEV_LABEL = 'Dev';

// alexa menu sections
export const ALEXA_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    label: TALK_LABEL,
    isLibrary: false,
    steps: [SPEAK_STEP, AUDIO_STEP, DISPLAY_STEP, CARD_STEP, STREAM_STEP],
  },
  {
    icon: LISTEN_ICON,
    label: LISTEN_LABEL,
    isLibrary: false,
    steps: [CHOICE_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    label: LOGIC_LABEL,
    isLibrary: false,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    isLibrary: false,
    steps: [INTENT_STEP, EVENT_STEP],
  },
  {
    icon: DEV_ICON,
    label: DEV_LABEL,
    isLibrary: false,
    steps: [API_STEP, CODE_STEP, TRACE_STEP, DIRECTIVE_STEP],
  },
];

// google menu sections
export const GOOGLE_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    label: TALK_LABEL,
    isLibrary: false,
    steps: [SPEAK_STEP, AUDIO_STEP, CARD_STEP, STREAM_STEP],
  },
  {
    icon: LISTEN_ICON,
    label: LISTEN_LABEL,
    isLibrary: false,
    steps: [CHOICE_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    label: LOGIC_LABEL,
    isLibrary: false,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    isLibrary: false,
    steps: [INTENT_STEP],
  },
  {
    icon: DEV_ICON,
    label: DEV_LABEL,
    isLibrary: false,
    steps: [API_STEP, CODE_STEP, TRACE_STEP, DIRECTIVE_STEP],
  },
];

// chatbot menu sections
export const CHATBOT_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    label: TALK_LABEL,
    isLibrary: false,
    steps: [TEXT_STEP, VISUAL_STEP, CARDV2_STEP, CAROUSEL_STEP],
  },
  {
    icon: LISTEN_ICON,
    label: LISTEN_LABEL,
    isLibrary: false,
    steps: [BUTTONS_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    label: LOGIC_LABEL,
    isLibrary: false,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    isLibrary: false,
    steps: [INTENT_STEP],
  },
  {
    icon: DEV_ICON,
    label: DEV_LABEL,
    isLibrary: false,
    steps: [API_STEP, CODE_STEP, TRACE_STEP],
  },
];

// general menu sections
export const GENERAL_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    label: TALK_LABEL,
    isLibrary: false,
    steps: [SPEAK_STEP, AUDIO_STEP, VISUAL_STEP],
  },
  {
    icon: LISTEN_ICON,
    label: LISTEN_LABEL,
    isLibrary: false,
    steps: [CHOICE_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    label: LOGIC_LABEL,
    isLibrary: false,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    isLibrary: false,
    steps: [INTENT_STEP],
  },
  {
    icon: DEV_ICON,
    label: DEV_LABEL,
    isLibrary: false,
    steps: [API_STEP, CODE_STEP, TRACE_STEP],
  },
];

// dialogflow chat menu sections
export const DIALOGFLOW_ES_CHAT_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    label: TALK_LABEL,
    isLibrary: false,
    steps: [TEXT_STEP, VISUAL_STEP, CARD_STEP, CAROUSEL_STEP, CUSTOM_PAYLOAD_STEP],
  },
  {
    icon: LISTEN_ICON,
    label: LISTEN_LABEL,
    isLibrary: false,
    steps: [BUTTONS_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    label: LOGIC_LABEL,
    isLibrary: false,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    isLibrary: false,
    steps: [INTENT_STEP],
  },
  {
    icon: DEV_ICON,
    label: DEV_LABEL,
    isLibrary: false,
    steps: [API_STEP, CODE_STEP, TRACE_STEP],
  },
];

// dialogflow voice menu sections
export const DIALOGFLOW_ES_VOICE_STEP_SECTIONS: TopStepItem[] = [
  {
    icon: TALK_ICON,
    label: TALK_LABEL,
    isLibrary: false,
    steps: [SPEAK_STEP, AUDIO_STEP, CUSTOM_PAYLOAD_STEP],
  },
  {
    icon: LISTEN_ICON,
    label: LISTEN_LABEL,
    isLibrary: false,
    steps: [CHOICE_STEP, CAPTURE_STEP_V2],
  },
  {
    icon: LOGIC_ICON,
    label: LOGIC_LABEL,
    isLibrary: false,
    steps: [CONDITION_STEP_V2, SET_STEP_V2, RANDOM_STEP_V2, COMPONENT_STEP, EXIT_STEP],
  },
  {
    icon: EVENT_ICON,
    label: EVENT_LABEL,
    isLibrary: false,
    steps: [INTENT_STEP],
  },
  {
    icon: DEV_ICON,
    label: DEV_LABEL,
    isLibrary: false,
    steps: [API_STEP, CODE_STEP, TRACE_STEP],
  },
];
