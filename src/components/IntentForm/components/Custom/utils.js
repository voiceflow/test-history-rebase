import { SLOT_REGEXP } from '@/constants';

const NUMERIC_UTTERANCE_REGEXP = /\d/;

// eslint-disable-next-line import/prefer-default-export
export function validateUtterance(utterance, intents, intentId) {
  const utteranceWithoutSlots = utterance.replace(SLOT_REGEXP, '');
  let err = '';
  if (utterance === '') {
    return 'Utterances must contain text';
  }

  if (NUMERIC_UTTERANCE_REGEXP.test(utteranceWithoutSlots)) {
    return 'Utterances cannot contain numbers, replace them with words or a slot that accepts numbers as a value.';
  }
  intents.some(({ inputs, id, name }) =>
    inputs.some(({ text }) => {
      if (text === utterance && id === intentId) {
        err = 'You already have this utterance in this list.';
        return true;
      }

      if (text === utterance) {
        err = `You already have this utterance defined in the "${name}" intent.`;
        return true;
      }

      return false;
    })
  );
  return err;
}
