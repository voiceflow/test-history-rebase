import { BlockType } from '../../../../constants';
import buttonsAdapter from './buttons';
import captureAdapter from './capture';
import interactionAdapter from './interaction';
import promptAdapter from './prompt';

// eslint-disable-next-line import/prefer-default-export
export const chatBlockAdapter = {
  // user defined
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.PROMPT]: promptAdapter,
  [BlockType.BUTTONS]: buttonsAdapter,
};
