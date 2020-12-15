import { BlockType, DialogType, IntegrationType, PlatformType } from '@/constants';
import { getManager } from '@/pages/Canvas/managers';

export const Section = {
  USER_INPUT: 'user input',
  RESPONSE: 'response',
  LOGIC: 'logic',
  INTEGRATION: 'integration',
  CHANNEL: 'channel',
};

// steps
const INTENT_STEP = {
  type: BlockType.INTENT,
  icon: 'user',
  label: 'Intent',
  iconColor: getManager(BlockType.INTENT).iconColor,
};

const SPEAK_STEP = {
  type: BlockType.SPEAK,
  label: 'Speak',
  icon: getManager(BlockType.SPEAK).getIcon({ dialogs: [{ type: DialogType.VOICE }] }),
  iconColor: getManager(BlockType.SPEAK).getIconColor({ dialogs: [{ type: DialogType.VOICE }] }),
  factoryData: { dialogs: [{ type: DialogType.VOICE }] },
};

const AUDIO_STEP = {
  type: BlockType.SPEAK,
  label: 'Audio',
  icon: getManager(BlockType.SPEAK).getIcon({ dialogs: [{ type: DialogType.AUDIO }] }),
  iconColor: getManager(BlockType.SPEAK).getIconColor({ dialogs: [{ type: DialogType.AUDIO }] }),
  factoryData: { dialogs: [{ type: DialogType.AUDIO }] },
};

const PROMPT_STEP = {
  type: BlockType.PROMPT,
  icon: 'prompt',
  label: 'Prompt',
  iconColor: getManager(BlockType.PROMPT).iconColor,
};

const CHOICE_STEP = {
  type: BlockType.CHOICE,
  icon: 'choice',
  label: 'Choice',
  iconColor: getManager(BlockType.CHOICE).iconColor,
};

const CONDITION_BLOCK = {
  type: BlockType.IF,
  icon: 'if',
  label: 'Condition',
  iconColor: getManager(BlockType.IF).iconColor,
};

const SET_BLOCK = {
  type: BlockType.SET,
  icon: 'code',
  label: 'Set',
  iconColor: getManager(BlockType.SET).iconColor,
};

const CAPTURE_BLOCK = {
  type: BlockType.CAPTURE,
  icon: 'microphone',
  label: 'Capture',
  iconColor: getManager(BlockType.CAPTURE).iconColor,
};

const RANDOM_BLOCK = {
  type: BlockType.RANDOM,
  icon: 'randomLoop',
  label: 'Random',
  iconColor: getManager(BlockType.RANDOM).iconColor,
};

const FLOW_BLOCK = {
  type: BlockType.FLOW,
  icon: 'flow',
  label: 'Flow',
  iconColor: getManager(BlockType.FLOW).iconColor,
};

const EXIT_BLOCK = {
  type: BlockType.EXIT,
  icon: 'exit',
  label: 'Exit',
  iconColor: getManager(BlockType.EXIT).iconColor,
};

const API_BLOCK = {
  type: BlockType.INTEGRATION,
  icon: getManager(BlockType.INTEGRATION).getIcon({ selectedIntegration: IntegrationType.CUSTOM_API }),
  label: 'API',
  iconColor: getManager(BlockType.INTEGRATION).getIconColor({ selectedIntegration: IntegrationType.CUSTOM_API }),
  factoryData: { selectedIntegration: IntegrationType.CUSTOM_API },
};

const GOOGLE_SHEETS_BLOCK = {
  type: BlockType.INTEGRATION,
  icon: getManager(BlockType.INTEGRATION).getIcon({ selectedIntegration: IntegrationType.GOOGLE_SHEETS }),
  label: 'Google Sheets',
  iconColor: getManager(BlockType.INTEGRATION).getIconColor({ selectedIntegration: IntegrationType.GOOGLE_SHEETS }),
  factoryData: { selectedIntegration: IntegrationType.GOOGLE_SHEETS },
  publicOnly: true,
};

const ZAPIER_BLOCK = {
  type: BlockType.INTEGRATION,
  icon: getManager(BlockType.INTEGRATION).getIcon({ selectedIntegration: IntegrationType.ZAPIER }),
  label: 'Zapier',
  iconColor: getManager(BlockType.INTEGRATION).getIconColor({ selectedIntegration: IntegrationType.ZAPIER }),
  factoryData: { selectedIntegration: IntegrationType.ZAPIER },
  publicOnly: true,
};

const CODE_BLOCK = {
  type: BlockType.CODE,
  icon: 'power',
  label: 'Custom Code',
  iconColor: getManager(BlockType.CODE).iconColor,
};

const STREAM_BLOCK = {
  type: BlockType.STREAM,
  icon: 'audioPlayer',
  label: 'Stream',
  iconColor: getManager(BlockType.STREAM).iconColor,
};

const CARD_BLOCK = {
  type: BlockType.CARD,
  icon: 'logs',
  label: 'Card',
  iconColor: getManager(BlockType.CARD).iconColor,
};

const EVENT_BLOCK = {
  type: BlockType.EVENT,
  icon: getManager(BlockType.EVENT).icon,
  label: getManager(BlockType.EVENT).label,
  iconColor: getManager(BlockType.EVENT).iconColor,
};

const DISPLAY_BLOCK = {
  type: BlockType.DISPLAY,
  icon: 'blocks',
  label: 'Display',
  iconColor: getManager(BlockType.DISPLAY).iconColor,
};

const PURCHASE_BLOCK = {
  type: BlockType.PAYMENT,
  icon: 'purchase',
  label: 'Purchase',
  iconColor: getManager(BlockType.PAYMENT).iconColor,
};

const CANCEL_PURCHASE_BLOCK = {
  type: BlockType.CANCEL_PAYMENT,
  icon: 'trash',
  label: 'Cancel Purchase',
  iconColor: getManager(BlockType.CANCEL_PAYMENT).iconColor,
};

const REMINDER_BLOCK = {
  type: BlockType.REMINDER,
  icon: 'reminder',
  label: 'Reminder',
  iconColor: getManager(BlockType.REMINDER).iconColor,
};

const USER_INFO_BLOCK = {
  type: BlockType.USER_INFO,
  icon: 'barGraph',
  label: 'User Info',
  iconColor: getManager(BlockType.USER_INFO).iconColor,
};

const PERMISSIONS_BLOCK = {
  type: BlockType.PERMISSION,
  icon: 'openLock',
  label: 'Permissions',
  iconColor: getManager(BlockType.PERMISSION).iconColor,
};

const ACCOUNT_LINKING_BLOCK = {
  type: BlockType.ACCOUNT_LINKING,
  icon: 'accountLinking',
  label: 'Account Linking',
  iconColor: getManager(BlockType.ACCOUNT_LINKING).iconColor,
};

const DIRECTIVE_BLOCK = {
  type: BlockType.DIRECTIVE,
  icon: getManager(BlockType.DIRECTIVE).icon,
  label: getManager(BlockType.DIRECTIVE).label,
  iconColor: getManager(BlockType.DIRECTIVE).iconColor,
};

// alexa menu sections
export const ALEXA_SECTIONS = [
  {
    type: Section.RESPONSE,
    label: 'Response',
    steps: [SPEAK_STEP, AUDIO_STEP, DISPLAY_BLOCK, CARD_BLOCK, STREAM_BLOCK],
  },
  {
    type: Section.USER_INPUT,
    label: 'User Input',
    steps: [CHOICE_STEP, PROMPT_STEP, INTENT_STEP, EVENT_BLOCK],
  },
  {
    type: Section.LOGIC,
    label: 'Logic',
    steps: [CONDITION_BLOCK, SET_BLOCK, CAPTURE_BLOCK, RANDOM_BLOCK, FLOW_BLOCK, EXIT_BLOCK],
  },
  {
    type: Section.INTEGRATION,
    label: 'Integration',
    steps: [API_BLOCK, GOOGLE_SHEETS_BLOCK, ZAPIER_BLOCK, CODE_BLOCK, DIRECTIVE_BLOCK],
  },
  {
    type: Section.CHANNEL,
    label: 'Channel',
    steps: [PURCHASE_BLOCK, CANCEL_PURCHASE_BLOCK, REMINDER_BLOCK, USER_INFO_BLOCK, PERMISSIONS_BLOCK, ACCOUNT_LINKING_BLOCK],
  },
];

// google menu sections
export const GOOGLE_SECTIONS = [
  {
    type: Section.RESPONSE,
    label: 'Response',
    steps: [SPEAK_STEP, AUDIO_STEP, CARD_BLOCK, STREAM_BLOCK],
  },
  {
    type: Section.USER_INPUT,
    label: 'User Input',
    steps: [CHOICE_STEP, PROMPT_STEP, INTENT_STEP],
  },
  {
    type: Section.LOGIC,
    label: 'Logic',
    steps: [CONDITION_BLOCK, SET_BLOCK, CAPTURE_BLOCK, RANDOM_BLOCK, FLOW_BLOCK, EXIT_BLOCK],
  },
  {
    type: Section.INTEGRATION,
    label: 'Integration',
    steps: [API_BLOCK, GOOGLE_SHEETS_BLOCK, ZAPIER_BLOCK, CODE_BLOCK],
  },
  {
    type: Section.CHANNEL,
    label: 'Channel',
    steps: [PURCHASE_BLOCK, CANCEL_PURCHASE_BLOCK, REMINDER_BLOCK, USER_INFO_BLOCK, PERMISSIONS_BLOCK, ACCOUNT_LINKING_BLOCK],
  },
];

// google menu sections
export const GENERAL_SECTIONS = [
  {
    type: Section.RESPONSE,
    label: 'Response',
    steps: [SPEAK_STEP, AUDIO_STEP],
  },
  {
    type: Section.USER_INPUT,
    label: 'User Input',
    steps: [CHOICE_STEP, PROMPT_STEP, INTENT_STEP],
  },
  {
    type: Section.LOGIC,
    label: 'Logic',
    steps: [CONDITION_BLOCK, SET_BLOCK, CAPTURE_BLOCK, RANDOM_BLOCK, FLOW_BLOCK, EXIT_BLOCK],
  },
  {
    type: Section.INTEGRATION,
    label: 'Integration',
    steps: [API_BLOCK, GOOGLE_SHEETS_BLOCK, ZAPIER_BLOCK, CODE_BLOCK],
  },
  {
    type: Section.CHANNEL,
    label: 'Channel',
    steps: [PURCHASE_BLOCK, CANCEL_PURCHASE_BLOCK, REMINDER_BLOCK, USER_INFO_BLOCK, PERMISSIONS_BLOCK, ACCOUNT_LINKING_BLOCK],
  },
];

// mapping each platform to corresponding list of sections
export const PLATFORM_SECTIONS = {
  [PlatformType.ALEXA]: ALEXA_SECTIONS,
  [PlatformType.GOOGLE]: GOOGLE_SECTIONS,
  [PlatformType.GENERAL]: GENERAL_SECTIONS,
};
