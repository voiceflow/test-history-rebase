import { BlockType } from '../../../../constants';
import { buttonsPortsAdapter } from './buttons';
import codeAdapter from './code';
import componentAdapter from './component';
import directiveAdapter from './directive';
import exitAdapter from './exit';
import flowAdapter from './flow';
import ifAdapter, { ifPortsAdapter } from './if';
import integrationAdapter from './integration';
import { interactionPortsAdapter } from './interaction';
import { promptPortsAdapter } from './prompt';
import randomAdapter from './random';
import setAdapter from './set';
import textAdapter from './text';
import traceAdapter, { tracePortsAdapter } from './trace';
import visualAdapter from './visual';

// adapters unique per platform
export { default as baseButtonsAdapter } from './buttons';
export { default as baseCaptureAdapter } from './capture';
export { default as baseCommandAdapter } from './command';
export { default as baseIntentAdapter } from './intent';
export { default as baseInteractionAdapter } from './interaction';
export { default as basePromptAdapter } from './prompt';
export { default as baseSpeakAdapter } from './speak';

// adapters shared across all platforms
export const baseBlockAdapter = {
  // user defined
  [BlockType.IFV2]: ifAdapter,
  [BlockType.TEXT]: textAdapter,
  [BlockType.SETV2]: setAdapter,
  [BlockType.EXIT]: exitAdapter,
  [BlockType.CODE]: codeAdapter,
  [BlockType.FLOW]: flowAdapter,
  [BlockType.COMPONENT]: componentAdapter,
  [BlockType.TRACE]: traceAdapter,
  [BlockType.VISUAL]: visualAdapter,
  [BlockType.RANDOM]: randomAdapter,
  [BlockType.DIRECTIVE]: directiveAdapter,
  [BlockType.INTEGRATION]: integrationAdapter,
};

// adapters shared across all platforms
export const basePortAdapter = {
  [BlockType.IF]: ifPortsAdapter,
  [BlockType.TRACE]: tracePortsAdapter,
  [BlockType.PROMPT]: promptPortsAdapter,
  [BlockType.CHOICE]: interactionPortsAdapter,
  [BlockType.BUTTONS]: buttonsPortsAdapter,
};
