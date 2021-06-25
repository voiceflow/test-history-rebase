import { Icon } from '@voiceflow/ui';
import _isFunction from 'lodash/isFunction';

import { BlockCategory, BlockType, DialogType, IntegrationType, PlatformType, RootOrMarkupBlockType } from '@/constants';
import { NodeData } from '@/models';
import { getManager } from '@/pages/Canvas/managers';
import { createPlatformSelector } from '@/utils/platform';

export type MenuStep = {
  type: BlockType;
  icon: Icon;
  label: string;
  iconColor?: string;
  publicOnly?: boolean;
  factoryData?: NodeData<any>;
};

const createMenuStep = (
  type: Exclude<BlockType, RootOrMarkupBlockType>,
  { publicOnly, factoryData }: { publicOnly?: boolean; factoryData?: NodeData<any> } = {}
): MenuStep => {
  const manager = getManager(type);

  return {
    type,
    icon: (_isFunction(manager.getIcon) && factoryData && manager.getIcon(factoryData)) || manager.icon!,
    label: (_isFunction(manager.getDataLabel) && factoryData && manager.getDataLabel(factoryData)) || manager.label,
    iconColor: (_isFunction(manager.getIconColor) && factoryData && manager.getIconColor(factoryData)) || manager.iconColor,
    publicOnly,
    factoryData,
  };
};

// STEPS

const ACCOUNT_LINKING_STEP = createMenuStep(BlockType.ACCOUNT_LINKING);

const CANCEL_PURCHASE_STEP = createMenuStep(BlockType.CANCEL_PAYMENT);

const CAPTURE_STEP = createMenuStep(BlockType.CAPTURE);

const CARD_STEP = createMenuStep(BlockType.CARD);

const CHOICE_STEP = createMenuStep(BlockType.CHOICE);

const CODE_STEP = createMenuStep(BlockType.CODE);

const DIRECTIVE_STEP = createMenuStep(BlockType.DIRECTIVE);

const DISPLAY_STEP = createMenuStep(BlockType.DISPLAY);

const EVENT_STEP = createMenuStep(BlockType.EVENT);

const CONDITION_STEP = createMenuStep(BlockType.IF);

const CONDITION_STEP_V2 = createMenuStep(BlockType.IFV2);

const EXIT_STEP = createMenuStep(BlockType.EXIT);

const FLOW_STEP = createMenuStep(BlockType.FLOW);

const API_STEP = createMenuStep(BlockType.INTEGRATION, { factoryData: { selectedIntegration: IntegrationType.CUSTOM_API } });

const GOOGLE_SHEETS_STEP = createMenuStep(BlockType.INTEGRATION, {
  publicOnly: true,
  factoryData: { selectedIntegration: IntegrationType.GOOGLE_SHEETS },
});

const INTENT_STEP = createMenuStep(BlockType.INTENT);

const PURCHASE_STEP = createMenuStep(BlockType.PAYMENT);

const PERMISSIONS_STEP = createMenuStep(BlockType.PERMISSION);

const PROMPT_STEP = createMenuStep(BlockType.PROMPT);

const RANDOM_STEP = createMenuStep(BlockType.RANDOM);

const REMINDER_STEP = createMenuStep(BlockType.REMINDER);

const SET_STEP = createMenuStep(BlockType.SET);

const SET_STEP_V2 = createMenuStep(BlockType.SETV2);

const SPEAK_STEP = createMenuStep(BlockType.SPEAK, { factoryData: { dialogs: [{ type: DialogType.VOICE }] } });

const AUDIO_STEP = createMenuStep(BlockType.SPEAK, { factoryData: { dialogs: [{ type: DialogType.AUDIO }] } });

const STREAM_STEP = createMenuStep(BlockType.STREAM);

const USER_INFO_STEP = createMenuStep(BlockType.USER_INFO);

const VISUAL_STEP = createMenuStep(BlockType.VISUAL);

const TRACE_STEP = createMenuStep(BlockType.TRACE);

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
    steps: [CHOICE_STEP, PROMPT_STEP, INTENT_STEP, EVENT_STEP],
  },
  {
    type: BlockCategory.LOGIC,
    label: 'Logic',
    steps: [CONDITION_STEP, CONDITION_STEP_V2, SET_STEP, SET_STEP_V2, CAPTURE_STEP, RANDOM_STEP, FLOW_STEP, EXIT_STEP],
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
    steps: [CHOICE_STEP, PROMPT_STEP, INTENT_STEP],
  },
  {
    type: BlockCategory.LOGIC,
    label: 'Logic',
    steps: [CONDITION_STEP, CONDITION_STEP_V2, SET_STEP, SET_STEP_V2, CAPTURE_STEP, RANDOM_STEP, FLOW_STEP, EXIT_STEP],
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
    steps: [CHOICE_STEP, PROMPT_STEP, INTENT_STEP],
  },
  {
    type: BlockCategory.LOGIC,
    label: 'Logic',
    steps: [CONDITION_STEP, CONDITION_STEP_V2, SET_STEP, SET_STEP_V2, CAPTURE_STEP, RANDOM_STEP, FLOW_STEP, EXIT_STEP],
  },
  {
    type: BlockCategory.INTEGRATION,
    label: 'Integration',
    steps: [API_STEP, GOOGLE_SHEETS_STEP, CODE_STEP, TRACE_STEP],
  },
];

export const getSections = createPlatformSelector(
  {
    [PlatformType.ALEXA]: ALEXA_SECTIONS,
    [PlatformType.GOOGLE]: GOOGLE_SECTIONS,
  },
  GENERAL_SECTIONS
);
