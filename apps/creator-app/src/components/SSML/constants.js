import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import _constant from 'lodash/constant';

import {
  getAlexaVoiceOptions,
  getGeneralVoiceOptions,
  getGoogleDialogflowVoiceOptions,
  getGoogleVoiceOptions,
} from '@/utils/voice';

const PROSODY_RATE_REGEXP = /^\d+(m?s)?$/;
const PROSODY_PITCH_REGEXP = /^(\+|-)\d+(\.\d+)?%$/;
const PROSODY_VOLUME_REGEXP = /^(\+|-)\d+(\.\d+)?dB$/;

const UNIVERSAL_SAY_AS_OPTS = [
  'cardinal',
  'ordinal',
  'characters',
  'fraction',
  'expletive',
  'unit',
  'spell-out',
  'date',
  'telephone',
];

export const UNIVERSAL_TAGS = {
  speak: {
    color: '#4f9ed1',
  },
  break: {
    color: '#4f9ed1',
    isSingle: true,
    attributes: {
      time: {
        type: 'text',
        validate: (value) => {
          if (value.match(/^\d+s$/) && parseInt(value, 10) > 10) {
            return {
              valid: false,
              error: 'the maximum allowed value is 10s',
            };
          }

          return {
            valid: !!value.match(/^\d+m?s$/),
            error: "you must specifiy intervals with 'ms' or 's' units",
          };
        },
        required: false,
        placeholder: '1s',
      },
      strength: {
        type: 'select',
        options: ['x-weak', 'weak', 'medium', 'strong', 'x-strong'],
        required: true,
      },
    },
  },
  p: {
    color: '#4f9ed1',
  },
  s: {
    color: '#4f9ed1',
  },
  sub: {
    color: '#c24689',
    attributes: {
      alias: {
        type: 'text',
        required: true,
        placeholder: 'Alias',
      },
    },
  },
  prosody: {
    color: '#4e6ff9',
    attributes: {
      rate: {
        type: 'text-select',
        options: ['x-slow', 'slow', 'medium', 'fast', 'x-fast'],
        validate: (value) => ({
          valid: !!value.match(PROSODY_RATE_REGEXP),
          error: "you can use only digests with 'm' or 'ms' postfix",
        }),
        required: false,
        placeholder: 'medium',
      },
      pitch: {
        type: 'text-select',
        options: ['x-low', 'low', 'medium', 'high', 'x-high'],
        validate: (value) => ({
          valid: !!value.match(PROSODY_PITCH_REGEXP),
          error: "you can use only numbers with +|- prefix and '%' postfix",
        }),
        required: false,
        placeholder: 'medium',
      },
      volume: {
        type: 'text-select',
        options: ['silent', 'x-soft', 'soft', 'medium', 'loud', 'x-loud'],
        validate: (value) => ({
          valid: !!value.match(PROSODY_VOLUME_REGEXP),
          error: "you can use only numbers with +|- prefix and 'dB' postfix",
        }),
        required: false,
        placeholder: 'medium',
      },
    },
  },
  emphasis: {
    color: '#8f8e94',
    attributes: {
      level: {
        type: 'select',
        options: ['strong', 'moderate', 'reduced'],
        required: true,
      },
    },
  },
};

export const ALEXA_DEFAULT_TAGS = {
  //  'amazon:domain': {
  //   color: '#e26d5a',
  //   attributes: {
  //     name: {
  //       type: 'select',
  //       options: ['news', 'music'],
  //       default: 'news',
  //       required: true,
  //     },
  //   },
  // },
  'amazon:effect': {
    color: '#3f8860',
    attributes: {
      name: {
        type: 'select',
        options: ['whispered'],
        default: 'whispered',
        required: true,
      },
    },
  },
  // 'amazon:emotion': {
  //   color: '#4fa9b3',
  //   attributes: {
  //     name: {
  //       type: 'select',
  //       options: ['excited', 'disappointed'],
  //       default: 'excited',
  //       required: true,
  //     },
  //     intensity: {
  //       type: 'select',
  //       options: ['low', 'medium', 'high'],
  //       required: true,
  //     },
  //   },
  // },
  'say-as': {
    color: '#c79839',
    attributes: {
      'interpret-as': {
        type: 'select',
        options: [...UNIVERSAL_SAY_AS_OPTS, 'number', 'digits', 'time', 'address', 'interjection'],
        default: 'characters',
        required: true,
      },
      format: {
        type: 'select',
        options: ['mdy', 'dmy', 'ymd', 'md', 'dm', 'ym', 'my', 'd', 'm', 'y'],
        default: 'characters',
        required: (_, attributes) => attributes['interpret-as'] === 'date',
      },
    },
  },
  audio: {
    color: '#c998a4',
    attributes: {
      src: {
        type: 'text',
        validate: () => ({ valid: _constant(true) }),
        required: true,
        placeholder: 'Enter url',
      },
    },
  },
  lang: {
    color: '#132144',
    attributes: {
      'xml:lang': {
        type: 'text',
        validate: () => ({ valid: _constant(true) }),
        required: true,
        placeholder: 'fr-FR',
      },
    },
  },
  phoneme: {
    color: '#4f58a0',
    attributes: {
      alphabet: {
        type: 'select',
        options: ['ipa', 'x-sampa'],
        required: true,
      },
      ph: {
        type: 'text',
        validate: () => ({ valid: _constant(true) }),
        required: true,
        placeholder: 'Pronunciation',
      },
    },
  },
  voice: {
    color: '#3e9840',
    attributes: {
      name: {
        type: 'select',
        options: ['Ivy', 'Joanna', 'Joey', 'Justin', 'Kendra', 'Kimberly', 'Matthew', 'Salli'],
        required: true,
      },
    },
  },
  w: {
    color: '#c79839',
    attributes: {
      role: {
        type: 'select',
        options: ['amazon:VB', 'amazon:VBD', 'amazon:NN', 'amazon:SENSE_1'],
        required: true,
      },
    },
  },
  ...UNIVERSAL_TAGS,
};

export const GOOGLE_DEFAULT_TAGS = {
  mark: {
    color: '#c24689',
    attributes: {
      name: {
        type: 'text',
        required: true,
        placeholder: 'Name',
      },
    },
  },
  par: {
    color: '#0f7ec0',
  },
  seq: {
    color: '#0f7ec0',
  },
  'say-as': {
    color: '#c79839',
    attributes: {
      'interpret-as': {
        type: 'select',
        options: UNIVERSAL_SAY_AS_OPTS,
        default: 'characters',
        required: true,
      },
      format: {
        type: 'select',
        options: ['mdy', 'dmy', 'ymd', 'md', 'dm', 'ym', 'my', 'd', 'm', 'y'],
        default: 'characters',
        required: (_, attributes) => attributes['interpret-as'] === 'date',
      },
    },
  },
  audio: {
    color: '#c998a4',
    attributes: {
      src: {
        type: 'text',
        validate: () => ({ valid: _constant(true) }),
        required: true,
        placeholder: 'Enter url',
      },
      clipBegin: { type: 'number', required: false },
      clipEnd: { type: 'number', required: false },
      speed: { type: 'number', required: false },
      repeatCount: { type: 'number', required: false },
      repeatDur: { type: 'number', required: false },
      soundLevel: { type: 'number', required: false },
    },
  },
  ...UNIVERSAL_TAGS,
};

export const GOOGLE_DIALOGFLOW_DEFAULT_TAGS = GOOGLE_DEFAULT_TAGS;

export const UNIVERSAL_ADD_OPTIONS = [
  {
    name: 'Break',
    options: [
      {
        tag: 'break',
        name: 'short-input',
        inputAttribute: 'time',
      },
      {
        tag: 'break',
        name: 'Short',
        attributes: {
          strength: 'medium',
        },
      },
      {
        tag: 'break',
        name: 'Sentence',
        attributes: {
          strength: 'strong',
        },
      },
      {
        tag: 'break',
        name: 'Paragraph',
        attributes: {
          strength: 'x-strong',
        },
      },
    ],
  },
  {
    name: 'Volume',
    options: [
      {
        tag: 'prosody',
        name: 'Silent',
        attributes: {
          volume: 'silent',
        },
      },
      {
        tag: 'prosody',
        name: 'Very Soft',
        attributes: {
          volume: 'x-soft',
        },
      },
      {
        tag: 'prosody',
        name: 'Soft',
        attributes: {
          volume: 'soft',
        },
      },
      {
        tag: 'prosody',
        name: 'Medium',
        attributes: {
          volume: 'medium',
        },
      },
      {
        tag: 'prosody',
        name: 'Loud',
        attributes: {
          volume: 'loud',
        },
      },
      {
        tag: 'prosody',
        name: 'Very Loud',
        attributes: {
          volume: 'x-loud',
        },
      },
    ],
  },
  {
    name: 'Speech Rate',
    options: [
      {
        tag: 'prosody',
        name: 'Very Slow',
        attributes: {
          rate: 'x-slow',
        },
      },
      {
        tag: 'prosody',
        name: 'Slow',
        attributes: {
          rate: 'slow',
        },
      },
      {
        tag: 'prosody',
        name: 'Medium',
        attributes: {
          rate: 'medium',
        },
      },
      {
        tag: 'prosody',
        name: 'Fast',
        attributes: {
          rate: 'fast',
        },
      },
      {
        tag: 'prosody',
        name: 'Very Fast',
        attributes: {
          rate: 'x-fast',
        },
      },
    ],
  },
  {
    name: 'Speech Tone (Pitch)',
    options: [
      {
        tag: 'prosody',
        name: 'Very Low',
        attributes: {
          pitch: 'x-low',
        },
      },
      {
        tag: 'prosody',
        name: 'Low',
        attributes: {
          pitch: 'low',
        },
      },
      {
        tag: 'prosody',
        name: 'Medium',
        attributes: {
          pitch: 'medium',
        },
      },
      {
        tag: 'prosody',
        name: 'High',
        attributes: {
          pitch: 'high',
        },
      },
      {
        tag: 'prosody',
        name: 'Very High',
        attributes: {
          pitch: 'x-high',
        },
      },
    ],
  },
  {
    name: 'Emphasis',
    options: [
      {
        tag: 'emphasis',
        name: 'Strong',
        attributes: {
          level: 'strong',
        },
      },
      {
        tag: 'emphasis',
        name: 'Moderate',
        attributes: {
          level: 'moderate',
        },
      },
      {
        tag: 'emphasis',
        name: 'Reduced',
        attributes: {
          level: 'reduced',
        },
      },
    ],
  },

  {
    name: 'Alias',
    options: [
      {
        tag: 'sub',
        name: 'Alias Input',
        inputAttribute: 'alias',
      },
    ],
  },
];

export const ALEXA_ADD_OPTIONS = [
  ...UNIVERSAL_ADD_OPTIONS,
  {
    name: 'Interpretation',
    options: [
      {
        name: 'Words',
        options: [
          {
            tag: 'say-as',
            name: 'Characters',
            attributes: {
              'interpret-as': 'characters',
            },
          },
          {
            tag: 'w',
            name: 'Verb',
            attributes: {
              role: 'amazon:VB',
            },
          },
          {
            tag: 'w',
            name: 'Past Participle',
            attributes: {
              role: 'amazon:VBD',
            },
          },
          {
            tag: 'w',
            name: 'Noun',
            attributes: {
              role: 'amazon:NN',
            },
          },
          {
            tag: 'w',
            name: 'Non-default Sense',
            attributes: {
              role: 'amazon:SENSE_1',
            },
          },
        ],
      },
      {
        name: 'Numbers',
        options: [
          {
            tag: 'say-as',
            name: 'Number',
            attributes: {
              'interpret-as': 'cardinal',
            },
          },
          {
            tag: 'say-as',
            name: 'Ordinal',
            attributes: {
              'interpret-as': 'ordinal',
            },
          },
          {
            tag: 'say-as',
            name: 'Digits',
            attributes: {
              'interpret-as': 'digits',
            },
          },
          {
            tag: 'say-as',
            name: 'Fraction',
            attributes: {
              'interpret-as': 'fraction',
            },
          },
          {
            tag: 'say-as',
            name: 'Unit',
            attributes: {
              'interpret-as': 'unit',
            },
          },
        ],
      },
      {
        name: 'Date and Time',
        options: [
          {
            tag: 'say-as',
            name: 'Time',
            attributes: {
              'interpret-as': 'time',
            },
          },
          {
            tag: 'say-as',
            name: 'Month-Day-Year',
            attributes: {
              'interpret-as': 'date',
              format: 'mdy',
            },
          },
          {
            tag: 'say-as',
            name: 'Day-Month-Year',
            attributes: {
              'interpret-as': 'date',
              format: 'dmy',
            },
          },
          {
            tag: 'say-as',
            name: 'Year-Month-Day',
            attributes: {
              'interpret-as': 'date',
              format: 'ymd',
            },
          },
          {
            tag: 'say-as',
            name: 'Month-Day',
            attributes: {
              'interpret-as': 'date',
              format: 'md',
            },
          },
          {
            tag: 'say-as',
            name: 'Day-Month',
            attributes: {
              'interpret-as': 'date',
              format: 'dm',
            },
          },
          {
            tag: 'say-as',
            name: 'Year-Month',
            attributes: {
              'interpret-as': 'date',
              format: 'ym',
            },
          },
          {
            tag: 'say-as',
            name: 'Month-Year',
            attributes: {
              'interpret-as': 'date',
              format: 'my',
            },
          },
          {
            tag: 'say-as',
            name: 'Day',
            attributes: {
              'interpret-as': 'date',
              format: 'd',
            },
          },
          {
            tag: 'say-as',
            name: 'Month',
            attributes: {
              'interpret-as': 'date',
              format: 'm',
            },
          },
          {
            tag: 'say-as',
            name: 'Year',
            attributes: {
              'interpret-as': 'date',
              format: 'y',
            },
          },
        ],
      },
      {
        name: 'Contacts',
        options: [
          {
            tag: 'say-as',
            name: 'Telephone',
            attributes: {
              'interpret-as': 'telephone',
            },
          },
          {
            tag: 'say-as',
            name: 'Address',
            attributes: {
              'interpret-as': 'address',
            },
          },
        ],
      },
      {
        name: 'Expressions',
        options: [
          {
            tag: 'say-as',
            name: 'Expletive',
            attributes: {
              'interpret-as': 'expletive',
            },
          },
          {
            tag: 'say-as',
            name: 'Interjection',
            attributes: {
              'interpret-as': 'interjection',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Phoneme',
    options: [
      {
        name: 'IPA',
        options: [
          {
            tag: 'phoneme',
            name: 'ipa-input',
            attributes: {
              alphabet: 'ipa',
            },
            inputAttribute: 'ph',
          },
        ],
      },
      {
        name: 'X-SAMPA',
        options: [
          {
            tag: 'phoneme',
            name: 'X-SAMPA',
            attributes: {
              alphabet: 'x-sampa',
            },
            inputAttribute: 'ph',
          },
        ],
      },
    ],
  },
  {
    tag: 'amazon:effect',
    name: 'Whisper',
    attributes: {
      name: 'whispered',
    },
  },
];

const ALEXA_SSML_META = {
  fallbackPlaceholder: (voice) => `Enter ${voice || 'Alexa'} reply, {} to add variables`,
  canChangeVoice: true,
  platformTags: ALEXA_DEFAULT_TAGS,
  addOptions: ALEXA_ADD_OPTIONS,
  voiceOptions: () => getAlexaVoiceOptions(),
};

const GOOGLE_SSML_META = {
  fallbackPlaceholder: () => 'Enter Google reply, {} to add variables',
  canChangeVoice: true,
  platformTags: GOOGLE_DEFAULT_TAGS,
  addOptions: UNIVERSAL_ADD_OPTIONS,
  voiceOptions: (locales, usePremiumVoice) => getGoogleVoiceOptions({ locales, usePremiumVoice }),
};

const GOOGLE_DIALOGFLOW_SSML_META = {
  fallbackPlaceholder: () => 'Enter assistant reply, {} to add variables',
  canChangeVoice: true,
  platformTags: GOOGLE_DIALOGFLOW_DEFAULT_TAGS,
  addOptions: UNIVERSAL_ADD_OPTIONS,
  voiceOptions: (locales, usePremiumVoice) => getGoogleDialogflowVoiceOptions({ locales, usePremiumVoice }),
};

const GENERAL_SSML_META = {
  fallbackPlaceholder: () => 'Enter Assistant reply, {} to add variables',
  canChangeVoice: true,
  platformTags: ALEXA_DEFAULT_TAGS,
  addOptions: ALEXA_ADD_OPTIONS,
  voiceOptions: (locales, usePremiumVoice) => getGeneralVoiceOptions({ locales, usePremiumVoice }),
};

export const getPlatformSSML = Utils.platform.createPlatformAndProjectTypeSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: ALEXA_SSML_META,
    [Platform.Constants.PlatformType.GOOGLE]: GOOGLE_SSML_META,
    [`${Platform.Constants.PlatformType.DIALOGFLOW_ES}:${Platform.Constants.ProjectType.VOICE}`]:
      GOOGLE_DIALOGFLOW_SSML_META,
  },
  GENERAL_SSML_META
);
