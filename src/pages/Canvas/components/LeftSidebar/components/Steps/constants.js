import { BlockType, IntegrationType, PlatformType } from '@/constants';
import { getManager } from '@/pages/Canvas/managers';

export const Section = {
  BASIC: 'basic',
  LOGIC: 'logic',
  PLATFORM: 'platform',
  INTEGRATION: 'integration',
};

export const ROOT_SECTIONS = [
  {
    type: Section.BASIC,
    label: 'Interaction',
    steps: [
      {
        type: BlockType.SPEAK,
        icon: 'speak',
        label: 'Speak',
        iconColor: getManager(BlockType.SPEAK).iconColor,
      },
      {
        type: BlockType.CHOICE,
        icon: 'choice',
        label: 'Choice',
        iconColor: getManager(BlockType.CHOICE).iconColor,
      },
      {
        type: BlockType.INTENT,
        icon: 'user',
        label: 'Intent',
        iconColor: getManager(BlockType.INTENT).iconColor,
      },
    ],
  },
  {
    type: Section.LOGIC,
    label: 'Logic',
    steps: [
      {
        type: BlockType.IF,
        icon: 'if',
        label: 'Condition',
        iconColor: getManager(BlockType.IF).iconColor,
      },
      {
        type: BlockType.SET,
        icon: 'code',
        label: 'Set',
        iconColor: getManager(BlockType.SET).iconColor,
      },
      {
        type: BlockType.CAPTURE,
        icon: 'microphone',
        label: 'Capture',
        iconColor: getManager(BlockType.CAPTURE).iconColor,
      },
      {
        type: BlockType.RANDOM,
        icon: 'randomLoop',
        label: 'Random',
        iconColor: getManager(BlockType.RANDOM).iconColor,
      },
      {
        type: BlockType.EXIT,
        icon: 'exit',
        label: 'Exit',
        iconColor: getManager(BlockType.EXIT).iconColor,
      },
      {
        type: BlockType.FLOW,
        icon: 'flow',
        label: 'Flow',
        iconColor: getManager(BlockType.FLOW).iconColor,
      },
    ],
  },
  {
    type: Section.INTEGRATION,
    label: 'Integration',
    steps: [
      {
        type: BlockType.INTEGRATION,
        icon: 'variable',
        label: 'API',
        iconColor: '#74a4bf',
        factoryData: { selectedIntegration: IntegrationType.CUSTOM_API },
      },
      {
        type: BlockType.INTEGRATION,
        icon: 'googleSheets',
        label: 'Google Sheets',
        iconColor: '#279745',
        factoryData: { selectedIntegration: IntegrationType.GOOGLE_SHEETS },
      },
      {
        type: BlockType.INTEGRATION,
        icon: 'zapier',
        label: 'Zapier',
        iconColor: '#e26d5a',
        factoryData: { selectedIntegration: IntegrationType.ZAPIER },
      },
    ],
  },
];

const SHARED_PLATFORM_STEPS = {
  STREAM: {
    type: BlockType.STREAM,
    icon: 'audioPlayer',
    label: 'Stream',
    iconColor: getManager(BlockType.STREAM).iconColor,
  },
  CARD: {
    type: BlockType.CARD,
    icon: 'logs',
    label: 'Card',
    iconColor: getManager(BlockType.CARD).iconColor,
  },
  CODE: {
    type: BlockType.CODE,
    icon: 'power',
    label: 'Custom Code',
    iconColor: getManager(BlockType.CODE).iconColor,
  },
};

export const PLATFORM_SECTION = {
  type: Section.PLATFORM,
  label: 'Platform',
  steps: {
    [PlatformType.ALEXA]: [
      SHARED_PLATFORM_STEPS.STREAM,
      {
        type: BlockType.DISPLAY,
        icon: 'blocks',
        label: 'Display',
        iconColor: getManager(BlockType.DISPLAY).iconColor,
      },
      SHARED_PLATFORM_STEPS.CARD,
      {
        type: BlockType.PAYMENT,
        icon: 'purchase',
        label: 'Purchase',
        iconColor: getManager(BlockType.PAYMENT).iconColor,
      },
      {
        type: BlockType.CANCEL_PAYMENT,
        icon: 'trash',
        label: 'Cancel Purchase',
        iconColor: getManager(BlockType.CANCEL_PAYMENT).iconColor,
      },
      SHARED_PLATFORM_STEPS.CODE,
      {
        type: BlockType.REMINDER,
        icon: 'clock',
        label: 'Reminder',
        iconColor: getManager(BlockType.REMINDER).iconColor,
      },
      {
        type: BlockType.USER_INFO,
        icon: 'barGraph',
        label: 'User Info',
        iconColor: getManager(BlockType.USER_INFO).iconColor,
      },
      {
        type: BlockType.PERMISSION,
        icon: 'openLock',
        label: 'Permissions',
        iconColor: getManager(BlockType.PERMISSION).iconColor,
      },
      {
        type: BlockType.ACCOUNT_LINKING,
        icon: 'accountLinking',
        label: 'Account Linking',
        iconColor: getManager(BlockType.ACCOUNT_LINKING).iconColor,
      },
    ],
    [PlatformType.GOOGLE]: [SHARED_PLATFORM_STEPS.STREAM, SHARED_PLATFORM_STEPS.CARD, SHARED_PLATFORM_STEPS.CODE],
  },
};
