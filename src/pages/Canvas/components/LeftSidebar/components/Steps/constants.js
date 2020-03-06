import { BlockType, PlatformType } from '@/constants';

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
        iconColor: '#8f8e94',
      },
      {
        type: BlockType.CHOICE,
        icon: 'choice',
        label: 'Choice',
        iconColor: '#3a5999',
      },
      {
        type: BlockType.INTENT,
        icon: 'user',
        label: 'Intent',
        iconColor: '#5589eb',
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
        iconColor: '#f86683',
      },
      {
        type: BlockType.SET,
        icon: 'code',
        label: 'Set',
        iconColor: '#5590b5',
      },
      {
        type: BlockType.CAPTURE,
        icon: 'microphone',
        label: 'Capture',
        iconColor: '#58457a',
      },
      {
        type: BlockType.RANDOM,
        icon: 'randomLoop',
        label: 'Random',
        iconColor: '#616c60',
      },
      {
        type: BlockType.EXIT,
        icon: 'exit',
        label: 'Exit',
        iconColor: '#d94c4c',
      },
      {
        type: BlockType.FLOW,
        icon: 'flow',
        label: 'Flow',
        iconColor: '#3c6997',
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
        factoryData: { type: 'API' },
      },
      {
        type: BlockType.INTEGRATION,
        icon: 'googleSheets',
        label: 'Google Sheets',
        iconColor: '#279745',
        factoryData: { type: 'GOOGLE' },
      },
      {
        type: BlockType.INTEGRATION,
        icon: 'zapier',
        label: 'Zapier',
        iconColor: '#e26d5a',
        factoryData: { type: 'ZAPIER' },
      },
    ],
  },
];

const SHARED_PLATFORM_STEPS = {
  STREAM: {
    type: BlockType.STREAM,
    icon: 'audioPlayer',
    label: 'Stream',
    iconColor: '#4f98c6',
  },
  CARD: {
    type: BlockType.CARD,
    icon: 'logs',
    label: 'Card',
    iconColor: '#616c60',
  },
  CODE: {
    type: BlockType.CODE,
    icon: 'power',
    label: 'Custom Code',
    iconColor: '#cdad32',
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
        iconColor: '#3c6997',
      },
      SHARED_PLATFORM_STEPS.CARD,
      {
        type: BlockType.PAYMENT,
        icon: 'purchase',
        label: 'Purchase',
        iconColor: '#558B2F',
      },
      {
        type: BlockType.CANCEL_PAYMENT,
        icon: 'trash',
        label: 'Cancel Purchase',
        iconColor: '#d94c4c',
      },
      SHARED_PLATFORM_STEPS.CODE,
      {
        type: BlockType.REMINDER,
        icon: 'clock',
        label: 'Reminder',
        iconColor: '#c998a4',
      },
      {
        type: BlockType.USER_INFO,
        icon: 'barGraph',
        label: 'User Info',
        iconColor: '#3C6997',
      },
      {
        type: BlockType.PERMISSION,
        icon: 'openLock',
        label: 'Permissions',
        iconColor: '#6e849a',
      },
      {
        type: BlockType.ACCOUNT_LINKING,
        icon: 'accountLinking',
        label: 'Account Linking',
        iconColor: '#645f5f',
      },
    ],
    [PlatformType.GOOGLE]: [SHARED_PLATFORM_STEPS.STREAM, SHARED_PLATFORM_STEPS.CARD, SHARED_PLATFORM_STEPS.CODE],
  },
};
