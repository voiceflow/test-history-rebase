import { BlockType } from '../../../../constants';
import buttonsAdapter from './buttons';
import captureAdapter from './capture';
import codeAdapter from './code';
import commandAdapter from './command';
import componentAdapter from './component';
import directiveAdapter from './directive';
import exitAdapter from './exit';
import flowAdapter from './flow';
import ifAdapter, { ifPortsAdapter } from './if';
import integrationAdapter from './integration';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import promptAdapter, { promptPortsAdapter } from './prompt';
import randomAdapter from './random';
import setAdapter from './set';
import speakAdapter from './speak';
import textAdapter from './text';
import traceAdapter, { tracePortsAdapter } from './trace';
import visualAdapter from './visual';

export const generalBlockAdapter = {
  // internal
  [BlockType.COMMAND]: commandAdapter,

  // user defined
  [BlockType.IFV2]: ifAdapter,
  [BlockType.TEXT]: textAdapter,
  [BlockType.SETV2]: setAdapter,
  [BlockType.EXIT]: exitAdapter,
  [BlockType.CODE]: codeAdapter,
  [BlockType.FLOW]: flowAdapter,
  [BlockType.COMPONENT]: componentAdapter,
  [BlockType.SPEAK]: speakAdapter,
  [BlockType.TRACE]: traceAdapter,
  [BlockType.PROMPT]: promptAdapter,
  [BlockType.VISUAL]: visualAdapter,
  [BlockType.INTENT]: intentAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.RANDOM]: randomAdapter,
  [BlockType.BUTTONS]: buttonsAdapter,
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.DIRECTIVE]: directiveAdapter,
  [BlockType.INTEGRATION]: integrationAdapter,
};

export const generalPortsAdapter = {
  [BlockType.TRACE]: tracePortsAdapter,
  [BlockType.IF]: ifPortsAdapter,
  [BlockType.PROMPT]: promptPortsAdapter,
};
