import { Node } from '@voiceflow/base-types';

import { BlockType } from '../../../../constants';
import { emptyOutPortsAdapter } from '../utils';
import { buttonsOutPortsAdapter } from './buttons';
import { captureOutPortsAdapter } from './capture';
import { captureV2OutPortsAdapter } from './captureV2';
import cardAdapter, { cardOutPortsAdapter } from './card';
import codeAdapter, { codeOutPortsAdapter } from './code';
import { commandOutPortsAdapter } from './command';
import componentAdapter, { componentOutPortsAdapter } from './component';
import directiveAdapter, { directiveOutPortsAdapter } from './directive';
import exitAdapter, { exitOutPortsAdapter } from './exit';
import flowAdapter, { flowOutPortsAdapter } from './flow';
import ifAdapter, { ifOutPortsAdapter } from './if';
import integrationAdapter, { integrationOutPortsAdapter } from './integration';
import { intentOutPortsAdapter } from './intent';
import { interactionOutPortsAdapter } from './interaction';
import { promptOutPortsAdapter } from './prompt';
import randomAdapter, { randomOutPortsAdapter } from './random';
import setAdapter, { setOutPortsAdapter } from './set';
import { speakOutPortsAdapter } from './speak';
import textAdapter, { textOutPortsAdapter } from './text';
import traceAdapter, { traceOutPortsAdapter } from './trace';
import visualAdapter, { visualOutPortsAdapter } from './visual';

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
  [BlockType.EXIT]: exitAdapter,
  [BlockType.CODE]: codeAdapter,
  [BlockType.CARD]: cardAdapter,
  [BlockType.FLOW]: flowAdapter,
  [BlockType.SETV2]: setAdapter,
  [BlockType.TRACE]: traceAdapter,
  [BlockType.VISUAL]: visualAdapter,
  [BlockType.RANDOM]: randomAdapter,
  [BlockType.DIRECTIVE]: directiveAdapter,
  [BlockType.COMPONENT]: componentAdapter,
  [BlockType.INTEGRATION]: integrationAdapter,
};

// adapters shared across all platforms
export const baseOutPortAdapter = {
  [BlockType.IF]: ifOutPortsAdapter,
  [BlockType.SET]: setOutPortsAdapter,
  [BlockType.EXIT]: exitOutPortsAdapter,
  [BlockType.CARD]: cardOutPortsAdapter,
  [BlockType.IFV2]: ifOutPortsAdapter,
  [BlockType.CODE]: codeOutPortsAdapter,
  [BlockType.FLOW]: flowOutPortsAdapter,
  [BlockType.TEXT]: textOutPortsAdapter,
  [BlockType.TRACE]: traceOutPortsAdapter,
  [BlockType.SETV2]: setOutPortsAdapter,
  [BlockType.SPEAK]: speakOutPortsAdapter,
  [BlockType.VISUAL]: visualOutPortsAdapter,
  [BlockType.INTENT]: intentOutPortsAdapter,
  [BlockType.PROMPT]: promptOutPortsAdapter,
  [BlockType.CHOICE]: interactionOutPortsAdapter,
  [BlockType.RANDOM]: randomOutPortsAdapter,
  [BlockType.COMMAND]: commandOutPortsAdapter,
  [BlockType.BUTTONS]: buttonsOutPortsAdapter,
  [BlockType.CAPTURE]: captureOutPortsAdapter,
  [BlockType.COMBINED]: emptyOutPortsAdapter,
  [BlockType.CAPTUREV2]: captureV2OutPortsAdapter,
  [BlockType.COMPONENT]: componentOutPortsAdapter,
  [BlockType.DIRECTIVE]: directiveOutPortsAdapter,
  [BlockType.CHOICE_OLD]: interactionOutPortsAdapter,
  [BlockType.INTEGRATION]: integrationOutPortsAdapter,

  [Node.NodeType.API]: integrationOutPortsAdapter,
  [Node.NodeType.ZAPIER]: integrationOutPortsAdapter,
  [Node.NodeType.GOOGLE_SHEETS]: integrationOutPortsAdapter,
};
