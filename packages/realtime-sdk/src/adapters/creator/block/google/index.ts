import { BlockType } from '../../../../constants';
import captureAdapter from './capture';
import cardAdapter from './card';
import commandAdapter from './command';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import promptAdapter from './prompt';
import speakAdapter from './speak';
import streamAdapter, { streamPortsAdapter } from './stream';

export const googleBlockAdapter = {
  // internal
  [BlockType.COMMAND]: commandAdapter,
  // user defined
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.CARD]: cardAdapter,
  [BlockType.INTENT]: intentAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.SPEAK]: speakAdapter,
  [BlockType.STREAM]: streamAdapter,
  [BlockType.PROMPT]: promptAdapter,
};

export const googlePortsAdapter = {
  [BlockType.STREAM]: streamPortsAdapter,
};
