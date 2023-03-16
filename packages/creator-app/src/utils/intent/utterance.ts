import { SLOT_REGEXP } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

const ALL_NUMBERS_REGEXP = /(\d*)/g;
const SLOT_REGEXP2 = /({{\[\w*].\w*}})/g;
const NUMERIC_UTTERANCE_REGEXP = /\d/;
const SPECIAL_CHARACTERS_REGEXP = /^[\w '.{}-]*$/g;

export const UTTERANCE_ERROR_MESSAGES = {
  EMPTY: 'Utterances must contain text',
  NUMBER: 'Utterances cannot contain numbers, replace them with words or a slot that accepts numbers as a value.',
  SPECIAL_CHARACTERS:
    'Utterances cannot contain some special characters, replace them with words or a slot that accepts special characters as a value.',
  INTENT_CONFLICT: 'You already have this utterance in this intent.',
  OTHER_INTENT_CONFLICT: (name: string) => `You already have this utterance defined in the "${name}" intent.`,
};

// validators
export const emptyUtteranceValidator = (utterance: string) => (utterance === '' ? UTTERANCE_ERROR_MESSAGES.EMPTY : null);

export const numericUtteranceValidator = (utterance: string) => {
  if (utterance.match(NUMERIC_UTTERANCE_REGEXP)) {
    return UTTERANCE_ERROR_MESSAGES.NUMBER;
  }

  return null;
};

export const specialCharactersUtteranceValidator = (utterance: string) => {
  if (!utterance.match(SPECIAL_CHARACTERS_REGEXP)) {
    return UTTERANCE_ERROR_MESSAGES.SPECIAL_CHARACTERS;
  }

  return null;
};

const getPlatformValidations = Realtime.Utils.platform.createPlatformSelector<((utterance: string) => string | null)[]>(
  {
    // TODO: add special characters validation again
    [Platform.Constants.PlatformType.ALEXA]: [emptyUtteranceValidator, numericUtteranceValidator],
    // TODO: add special characters validation again
    [Platform.Constants.PlatformType.GOOGLE]: [emptyUtteranceValidator, numericUtteranceValidator],
  },
  [emptyUtteranceValidator]
);

export function validateUtterance(
  utterance: string,
  intentID: string | null,
  intents: Platform.Base.Models.Intent.Model[],
  platform: Platform.Constants.PlatformType,
  currentIntentInputs?: Platform.Base.Models.Intent.Input[]
): string {
  const utteranceWithoutSlots = utterance.replace(SLOT_REGEXP, '');

  const validations = getPlatformValidations(platform);
  const platformValidationError = validations.reduce<string | null>((error, validation) => {
    if (error) return error;
    return validation(utteranceWithoutSlots);
  }, null);

  let err = '';

  if (platformValidationError) return platformValidationError;

  const lowercaseUtterance = utterance.toLowerCase();

  currentIntentInputs?.some(({ text }) => {
    if (text.toLowerCase() === lowercaseUtterance) {
      err = UTTERANCE_ERROR_MESSAGES.INTENT_CONFLICT;

      return true;
    }

    return false;
  });

  intents.some(({ inputs, id, name }) =>
    inputs.some(({ text }) => {
      if (text.toLowerCase() === lowercaseUtterance) {
        err = id === intentID ? UTTERANCE_ERROR_MESSAGES.INTENT_CONFLICT : UTTERANCE_ERROR_MESSAGES.OTHER_INTENT_CONFLICT(name);

        return true;
      }

      return false;
    })
  );

  return err;
}

// formatters
export const numberUtteranceFormatter = (utterance: string) => utterance.replace(ALL_NUMBERS_REGEXP, '');

const getPlatformFormatters = Realtime.Utils.platform.createPlatformSelector<((utterance: string) => string)[]>(
  {
    [Platform.Constants.PlatformType.ALEXA]: [numberUtteranceFormatter],
    [Platform.Constants.PlatformType.GOOGLE]: [numberUtteranceFormatter],
  },
  []
);

export const formatUtterance = (platform: Platform.Constants.PlatformType, text = ''): string => {
  const formatters = getPlatformFormatters(platform);

  if (formatters.length === 0) return text;

  return text
    .split(SLOT_REGEXP2)
    .map((part) => {
      let formatted = part;

      if (!part.match(SLOT_REGEXP2)) {
        formatters.forEach((formatter) => {
          formatted = formatter(formatted);
        });
      }

      return formatted;
    })
    .join('');
};
