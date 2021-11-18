import { BlockType } from '@realtime-sdk/constants';

import captureAdapter from './capture';
import commandAdapter from './command';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import promptAdapter from './prompt';
import speakAdapter from './speak';
import streamAdapter, { streamOutPortsAdapter } from './stream';

export const googleBlockAdapter = {
  // internal
  [BlockType.COMMAND]: commandAdapter,

  // user defined
  [BlockType.SPEAK]: speakAdapter,
  [BlockType.STREAM]: streamAdapter,
  [BlockType.PROMPT]: promptAdapter,
  [BlockType.INTENT]: intentAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.CAPTURE]: captureAdapter,
};

export const googleOutPortAdapter = {
  [BlockType.STREAM]: streamOutPortsAdapter,
};
