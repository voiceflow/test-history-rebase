import { BlockType } from '@/constants';

import captureAdapter from './capture';
import codeAdapter from './code';
import commandAdapter from './command';
import directiveAdapter from './directive';
import exitAdapter from './exit';
import flowAdapter from './flow';
import ifAdapter from './if';
import ifAdapterV2, { ifPortsAdapter } from './ifV2';
import integrationAdapter from './integration';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import promptAdapter from './prompt';
import randomAdapter from './random';
import setAdapter from './set';
import setAdapterV2 from './setV2';
import speakAdapter from './speak';
import traceAdapter, { tracePortsAdapter } from './trace';
import visualAdapter from './visual';

export const generalBlockAdapter = {
  // internal
  [BlockType.COMMAND]: commandAdapter,

  // user defined
  [BlockType.IF]: ifAdapter,
  [BlockType.IFV2]: ifAdapterV2,
  [BlockType.SET]: setAdapter,
  [BlockType.SETV2]: setAdapterV2,
  [BlockType.EXIT]: exitAdapter,
  [BlockType.CODE]: codeAdapter,
  [BlockType.FLOW]: flowAdapter,
  [BlockType.SPEAK]: speakAdapter,
  [BlockType.TRACE]: traceAdapter,
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
  [BlockType.TRACE]: tracePortsAdapter,
  [BlockType.IF]: ifPortsAdapter,
};
