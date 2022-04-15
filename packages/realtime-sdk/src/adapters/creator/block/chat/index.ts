import { BlockType } from '@realtime-sdk/constants';

import buttonsAdapter from './buttons';
import captureAdapter from './capture';
import captureV2Adapter from './captureV2';
import interactionAdapter from './interaction';
import promptAdapter from './prompt';

export const chatBlockAdapter = {
  // user defined
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.PROMPT]: promptAdapter,
  [BlockType.BUTTONS]: buttonsAdapter,
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.CAPTUREV2]: captureV2Adapter,
};
