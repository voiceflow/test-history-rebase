import { BlockCategory, BlockType, DialogType, IntegrationType, PlatformType } from '@/constants';
import { NodeData } from '@/models';
import { getManager } from '@/pages/Canvas/managers';
import { Icon } from '@/svgs/types';

type MenuStep = {
  type: BlockType;
  icon: Icon | React.FC;
  label: string;
  iconColor?: string;
  factoryData?: NodeData<any>;
  publicOnly?: boolean;
};

// steps
const INTENT_STEP: MenuStep = {
  type: BlockType.INTENT,
  icon: 'user',
  label: 'Intent',
  iconColor: getManager(BlockType.INTENT).iconColor,
};

const SPEAK_STEP: MenuStep = {
  type: BlockType.SPEAK,
  label: 'Speak',
  icon: getManager(BlockType.SPEAK).getIcon!({ dialogs: [{ type: DialogType.VOICE }] } as NodeData.Speak),
  iconColor: getManager(BlockType.SPEAK).getIconColor!({ dialogs: [{ type: DialogType.VOICE }] } as NodeData.Speak),
  factoryData: { dialogs: [{ type: DialogType.VOICE }] },
};

const AUDIO_STEP: MenuStep = {
  type: BlockType.SPEAK,
  label: 'Audio',
  icon: getManager(BlockType.SPEAK).getIcon!({ dialogs: [{ type: DialogType.AUDIO }] } as NodeData.Speak),
  iconColor: getManager(BlockType.SPEAK).getIconColor!({ dialogs: [{ type: DialogType.AUDIO }] } as NodeData.Speak),
  factoryData: { dialogs: [{ type: DialogType.AUDIO }] },
};

const PROMPT_STEP: MenuStep = {
  type: BlockType.PROMPT,
  icon: 'prompt',
  label: 'Prompt',
  iconColor: getManager(BlockType.PROMPT).iconColor,
};

const CHOICE_STEP: MenuStep = {
  type: BlockType.CHOICE,
  icon: 'choice',
  label: 'Choice',
  iconColor: getManager(BlockType.CHOICE).iconColor,
};

const CONDITION_STEP: MenuStep = {
  type: BlockType.IF,
  icon: 'if',
  label: 'Condition',
  iconColor: getManager(BlockType.IF).iconColor,
};

const SET_STEP: MenuStep = {
  type: BlockType.SET,
  icon: 'code',
  label: 'Set',
  iconColor: getManager(BlockType.SET).iconColor,
};

const CAPTURE_STEP: MenuStep = {
  type: BlockType.CAPTURE,
  icon: 'microphone',
  label: 'Capture',
  iconColor: getManager(BlockType.CAPTURE).iconColor,
};

const RANDOM_STEP: MenuStep = {
  type: BlockType.RANDOM,
  icon: 'randomLoop',
  label: 'Random',
  iconColor: getManager(BlockType.RANDOM).iconColor,
};

const FLOW_STEP: MenuStep = {
  type: BlockType.FLOW,
  icon: 'flow',
  label: 'Flow',
  iconColor: getManager(BlockType.FLOW).iconColor,
};

const EXIT_STEP: MenuStep = {
  type: BlockType.EXIT,
  icon: 'exit',
  label: 'Exit',
  iconColor: getManager(BlockType.EXIT).iconColor,
};

const API_STEP: MenuStep = {
  type: BlockType.INTEGRATION,
  icon: getManager(BlockType.INTEGRATION).getIcon!({ selectedIntegration: IntegrationType.CUSTOM_API }),
  label: 'API',
  iconColor: getManager(BlockType.INTEGRATION).getIconColor!({ selectedIntegration: IntegrationType.CUSTOM_API }),
  factoryData: { selectedIntegration: IntegrationType.CUSTOM_API },
};

const GOOGLE_SHEETS_STEP: MenuStep = {
  type: BlockType.INTEGRATION,
  icon: getManager(BlockType.INTEGRATION).getIcon!({ selectedIntegration: IntegrationType.GOOGLE_SHEETS } as NodeData.Integration),
  label: 'Google Sheets',
  iconColor: getManager(BlockType.INTEGRATION).getIconColor!({ selectedIntegration: IntegrationType.GOOGLE_SHEETS } as NodeData.Integration),
  factoryData: { selectedIntegration: IntegrationType.GOOGLE_SHEETS },
  publicOnly: true,
};

const ZAPIER_STEP: MenuStep = {
  type: BlockType.INTEGRATION,
  icon: getManager(BlockType.INTEGRATION).getIcon!({ selectedIntegration: IntegrationType.ZAPIER }),
  label: 'Zapier',
  iconColor: getManager(BlockType.INTEGRATION).getIconColor!({ selectedIntegration: IntegrationType.ZAPIER }),
  factoryData: { selectedIntegration: IntegrationType.ZAPIER },
  publicOnly: true,
};

const CODE_STEP: MenuStep = {
  type: BlockType.CODE,
  icon: 'power',
  label: 'Custom Code',
  iconColor: getManager(BlockType.CODE).iconColor,
};

const STREAM_STEP: MenuStep = {
  type: BlockType.STREAM,
  icon: 'audioPlayer',
  label: 'Stream',
  iconColor: getManager(BlockType.STREAM).iconColor,
};

const CARD_STEP: MenuStep = {
  type: BlockType.CARD,
  icon: 'logs',
  label: 'Card',
  iconColor: getManager(BlockType.CARD).iconColor,
};

const EVENT_STEP: MenuStep = {
  type: BlockType.EVENT,
  icon: getManager(BlockType.EVENT).icon!,
  label: getManager(BlockType.EVENT).label,
  iconColor: getManager(BlockType.EVENT).iconColor,
};

const DISPLAY_STEP: MenuStep = {
  type: BlockType.DISPLAY,
  icon: 'blocks',
  label: 'Display',
  iconColor: getManager(BlockType.DISPLAY).iconColor,
};

const PURCHASE_STEP: MenuStep = {
  type: BlockType.PAYMENT,
  icon: 'purchase',
  label: 'Purchase',
  iconColor: getManager(BlockType.PAYMENT).iconColor,
};

const CANCEL_PURCHASE_STEP: MenuStep = {
  type: BlockType.CANCEL_PAYMENT,
  icon: 'trash',
  label: 'Cancel Purchase',
  iconColor: getManager(BlockType.CANCEL_PAYMENT).iconColor,
};

const REMINDER_STEP: MenuStep = {
  type: BlockType.REMINDER,
  icon: 'reminder',
  label: 'Reminder',
  iconColor: getManager(BlockType.REMINDER).iconColor,
};

const USER_INFO_STEP: MenuStep = {
  type: BlockType.USER_INFO,
  icon: 'barGraph',
  label: 'User Info',
  iconColor: getManager(BlockType.USER_INFO).iconColor,
};

const PERMISSIONS_STEP: MenuStep = {
  type: BlockType.PERMISSION,
  icon: 'openLock',
  label: 'Permissions',
  iconColor: getManager(BlockType.PERMISSION).iconColor,
};

const ACCOUNT_LINKING_STEP: MenuStep = {
  type: BlockType.ACCOUNT_LINKING,
  icon: 'accountLinking',
  label: 'Account Linking',
  iconColor: getManager(BlockType.ACCOUNT_LINKING).iconColor,
};

const DIRECTIVE_STEP: MenuStep = {
  type: BlockType.DIRECTIVE,
  icon: getManager(BlockType.DIRECTIVE).icon!,
  label: getManager(BlockType.DIRECTIVE).label,
  iconColor: getManager(BlockType.DIRECTIVE).iconColor,
};

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
    steps: [CONDITION_STEP, SET_STEP, CAPTURE_STEP, RANDOM_STEP, FLOW_STEP, EXIT_STEP],
  },
  {
    type: BlockCategory.INTEGRATION,
    label: 'Integration',
    steps: [API_STEP, GOOGLE_SHEETS_STEP, ZAPIER_STEP, CODE_STEP, DIRECTIVE_STEP],
  },
  {
    type: BlockCategory.CHANNEL,
    label: 'Channel',
    steps: [PURCHASE_STEP, CANCEL_PURCHASE_STEP, REMINDER_STEP, USER_INFO_STEP, PERMISSIONS_STEP, ACCOUNT_LINKING_STEP],
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
    steps: [CONDITION_STEP, SET_STEP, CAPTURE_STEP, RANDOM_STEP, FLOW_STEP, EXIT_STEP],
  },
  {
    type: BlockCategory.INTEGRATION,
    label: 'Integration',
    steps: [API_STEP, GOOGLE_SHEETS_STEP, ZAPIER_STEP, CODE_STEP],
  },
  {
    type: BlockCategory.CHANNEL,
    label: 'Channel',
    steps: [PURCHASE_STEP, CANCEL_PURCHASE_STEP, REMINDER_STEP, USER_INFO_STEP, PERMISSIONS_STEP, ACCOUNT_LINKING_STEP],
  },
];

// general menu sections
export const GENERAL_SECTIONS = [
  {
    type: BlockCategory.RESPONSE,
    label: 'Response',
    steps: [SPEAK_STEP, AUDIO_STEP],
  },
  {
    type: BlockCategory.USER_INPUT,
    label: 'User Input',
    steps: [CHOICE_STEP, PROMPT_STEP, INTENT_STEP],
  },
  {
    type: BlockCategory.LOGIC,
    label: 'Logic',
    steps: [CONDITION_STEP, SET_STEP, CAPTURE_STEP, RANDOM_STEP, FLOW_STEP, EXIT_STEP],
  },
  {
    type: BlockCategory.INTEGRATION,
    label: 'Integration',
    steps: [API_STEP, GOOGLE_SHEETS_STEP, ZAPIER_STEP, CODE_STEP],
  },
  {
    type: BlockCategory.CHANNEL,
    label: 'Channel',
    steps: [PURCHASE_STEP, CANCEL_PURCHASE_STEP, REMINDER_STEP, USER_INFO_STEP, PERMISSIONS_STEP, ACCOUNT_LINKING_STEP],
  },
];

// mapping each platform to corresponding list of sections
export const PLATFORM_SECTIONS = {
  [PlatformType.ALEXA]: ALEXA_SECTIONS,
  [PlatformType.GOOGLE]: GOOGLE_SECTIONS,
  [PlatformType.GENERAL]: GENERAL_SECTIONS,
};
