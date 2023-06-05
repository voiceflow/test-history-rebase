import { BlockType } from '@realtime-sdk/constants';

import captureAdapter from './capture';
import captureV2Adapter from './captureV2';
import commandAdapter from './command';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import promptAdapter from './prompt';
import speakAdapter from './speak';

export const alexaBlockAdapter = {
  // internal
  [BlockType.COMMAND]: commandAdapter,

  // user defined
  [BlockType.SPEAK]: speakAdapter,

  [BlockType.PROMPT]: promptAdapter,
  [BlockType.INTENT]: intentAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.CAPTUREV2]: captureV2Adapter,
};

export const alexaOutPortAdapter = {};

export const alexaOutPortAdapterV2 = {};
