import { BlockType } from '@realtime-sdk/constants';

import captureAdapter from './capture';
import captureV2Adapter from './captureV2';
import commandAdapter from './command';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import promptAdapter from './prompt';
import speakAdapter from './speak';
import streamAdapter, { streamOutPortsAdapter, streamOutPortsAdapterV2 } from './stream';

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
  [BlockType.CAPTUREV2]: captureV2Adapter,
};

export const googleOutPortAdapter = {
  [BlockType.STREAM]: streamOutPortsAdapter,
};

export const googleOutPortAdapterV2 = {
  [BlockType.STREAM]: streamOutPortsAdapterV2,
};
