import { BlockType } from '@/constants';

import captureAdapter from './capture';
import codeAdapter from './code';
import commandAdapter from './command';
import directiveAdapter from './directive';
import exitAdapter from './exit';
import flowAdapter from './flow';
import ifAdapter from './if';
import integrationAdapter from './integration';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import promptAdapter from './prompt';
import randomAdapter from './random';
import setAdapter from './set';
import speakAdapter from './speak';
import streamAdapter, { streamPortsAdapter } from './stream';
import traceAdapter, { tracePortsAdapter } from './trace';
import visualAdapter from './visual';

export const generalBlockAdapter = {
  // internal
  [BlockType.COMMAND]: commandAdapter,

  // user defined
  [BlockType.IF]: ifAdapter,
  [BlockType.SET]: setAdapter,
  [BlockType.EXIT]: exitAdapter,
  [BlockType.CODE]: codeAdapter,
  [BlockType.FLOW]: flowAdapter,
  [BlockType.SPEAK]: speakAdapter,
  [BlockType.TRACE]: traceAdapter,
  [BlockType.STREAM]: streamAdapter,
  [BlockType.PROMPT]: promptAdapter,
  [BlockType.VISUAL]: visualAdapter,
  [BlockType.INTENT]: intentAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.RANDOM]: randomAdapter,
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.DIRECTIVE]: directiveAdapter,
  [BlockType.INTEGRATION]: integrationAdapter,
};

export const generalPortsAdapter = {
  [BlockType.STREAM]: streamPortsAdapter,
  [BlockType.TRACE]: tracePortsAdapter,
};
