import { constants } from '@voiceflow/common';

export const { BUILT_IN_INTENTS_ALEXA, BUILT_IN_INTENTS_GOOGLE } = constants.intents;
export const SLOT_TYPES = constants.slots;

export const CMD_Z = 'command+z';
export const CTRL_Z = 'ctrl+z';
export const CTRL_SHIFT_Z = 'ctrl+shift+z';
export const CMD_Y = 'command+y';
export const CTRL_Y = 'ctrl+y';
export const CMD_SHIFT_Z = 'command+shift+z';

export const ALEXA_BUILT_INS =
  BUILT_IN_INTENTS_ALEXA &&
  BUILT_IN_INTENTS_ALEXA.map((intent) => {
    return {
      built_in: true,
      platform: 'alexa',
      name: intent.name,
      key: intent.name,
      inputs: [
        {
          text: '',
          slots: intent.slots,
        },
      ],
    };
  });

export const GOOGLE_BUILT_INS =
  BUILT_IN_INTENTS_GOOGLE &&
  BUILT_IN_INTENTS_GOOGLE.map((intent) => {
    return {
      built_in: true,
      platform: 'google',
      name: intent.name,
      key: intent.name,
      inputs: [
        {
          text: '',
          slots: intent.slots,
        },
      ],
    };
  });
