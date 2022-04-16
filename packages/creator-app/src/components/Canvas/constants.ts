import { BuiltInVariable } from '@voiceflow/realtime-sdk';

import { Identifier } from '@/styles/constants';

export const CANVAS_BUSY_CLASSNAME = `${Identifier.CANVAS}--busy`;
export const CANVAS_INTERACTING_CLASSNAME = `${Identifier.CANVAS}--interacting`;
export const CANVAS_ANIMATING_CLASSNAME = `${Identifier.CANVAS}--animating`;
export const CANVAS_SHIFT_PRESSED_CLASSNAME = `${Identifier.CANVAS}--shift-pressed`;

export const ZOOM_FACTOR = 100;
export const MIN_ZOOM = 10;
export const MAX_ZOOM = 200;

export const SCROLL_FACTOR = 60;
export const PINCH_SCROLL_FACTOR = 3;

export const MAX_CLICK_TRAVEL = 10;
export const SCROLL_TIMEOUT = 500;
export const ANIMATION_TIMEOUT = 250;

export enum ControlScheme {
  MOUSE = 'MOUSE',
  TRACKPAD = 'TRACKPAD',
}

export enum ZoomType {
  REGULAR = 'REGULAR',
  INVERSE = 'INVERSE',
}

export enum ControlType {
  START_INTERACTION = 'START_INTERACTION',
  END_INTERACTION = 'END_INTERACTION',
  SCALE = 'SCALE',
  PAN = 'PAN',
  CLICK = 'CLICK',
  END = 'END',
  MOUSE_UP = 'MOUSE_UP',
  SELECT_DRAG_START = 'SELECT_DRAG_START',
}

export const VARIABLE_DESCRIPTION: Record<string, string> = {
  [BuiltInVariable.SESSIONS]: 'The number of times a particular user has opened the app',
  [BuiltInVariable.USER_ID]: "The user's Amazon/Google unique ID",
  [BuiltInVariable.TIMESTAMP]: 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC)',
  [BuiltInVariable.PLATFORM]: 'The platform your skill is running on ("voiceflow", "alexa" or "google")',
  [BuiltInVariable.LOCALE]: 'The locale of the user (eg. en-US, en-CA, it-IT, fr-FR, ...)',
  [BuiltInVariable.INTENT_CONFIDENCE]: 'The confidence interval (measured as a value from 0 to 100) for the most recently matched intent',
  [BuiltInVariable.LAST_UTTERANCE]: `The user's last utterance in a text string`,
  [BuiltInVariable.CHANNEL]: 'This communicates the actual channel that dialogflow is running on.',
};
