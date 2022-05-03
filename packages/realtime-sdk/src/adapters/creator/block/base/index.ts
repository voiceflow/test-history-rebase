import { BaseNode } from '@voiceflow/base-types';

import { BlockType } from '../../../../constants';
import { emptyOutPortsAdapter, emptyOutPortsAdapterV2 } from '../utils';
import { buttonsOutPortsAdapter, buttonsOutPortsAdapterV2 } from './buttons';
import { captureOutPortsAdapter, captureOutPortsAdapterV2 } from './capture';
import { captureV2OutPortsAdapter, captureV2OutPortsAdapterV2 } from './captureV2';
import cardAdapter, { cardOutPortsAdapter, cardOutPortsAdapterV2 } from './card';
import cardV2Adapter, { cardV2OutPortsAdapter, cardV2OutPortsAdapterV2 } from './cardV2';
import codeAdapter, { codeOutPortsAdapter, codeOutPortsAdapterV2 } from './code';
import { commandOutPortsAdapter, commandOutPortsAdapterV2 } from './command';
import componentAdapter, { componentOutPortsAdapter, componentOutPortsAdapterV2 } from './component';
import directiveAdapter, { directiveOutPortsAdapter, directiveOutPortsAdapterV2 } from './directive';
import exitAdapter, { exitOutPortsAdapter, exitOutPortsAdapterV2 } from './exit';
import flowAdapter, { flowOutPortsAdapter, flowOutPortsAdapterV2 } from './flow';
import ifAdapter, { ifOutPortsAdapter, ifOutPortsAdapterV2 } from './if';
import integrationAdapter, { integrationOutPortsAdapter, integrationOutPortsAdapterV2 } from './integration';
import { intentOutPortsAdapter, intentOutPortsAdapterV2 } from './intent';
import { interactionOutPortsAdapter, interactionOutPortsAdapterV2 } from './interaction';
import { promptOutPortsAdapter, promptOutPortsAdapterV2 } from './prompt';
import randomAdapter, { randomOutPortsAdapter, randomOutPortsAdapterV2 } from './random';
import setAdapter, { setOutPortsAdapter, setOutPortsAdapterV2 } from './set';
import { speakOutPortsAdapter, speakOutPortsAdapterV2 } from './speak';
import textAdapter, { textOutPortsAdapter, textOutPortsAdapterV2 } from './text';
import traceAdapter, { traceOutPortsAdapter, traceOutPortsAdapterV2 } from './trace';
import visualAdapter, { visualOutPortsAdapter, visualOutPortsAdapterV2 } from './visual';

// adapters unique per platform
export { default as baseButtonsAdapter } from './buttons';
export { default as baseCaptureAdapter } from './capture';
export { default as baseCaptureV2Adapter } from './captureV2';
export { default as baseCardV2Adapter } from './cardV2';
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
  [BlockType.CARDV2]: cardV2Adapter,
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
  [BlockType.CARDV2]: cardV2OutPortsAdapter,
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

  [BaseNode.NodeType.API]: integrationOutPortsAdapter,
  [BaseNode.NodeType.ZAPIER]: integrationOutPortsAdapter,
  [BaseNode.NodeType.GOOGLE_SHEETS]: integrationOutPortsAdapter,
};

// adapters shared across all platforms
export const baseOutPortAdapterV2 = {
  [BlockType.IF]: ifOutPortsAdapterV2,
  [BlockType.SET]: setOutPortsAdapterV2,
  [BlockType.EXIT]: exitOutPortsAdapterV2,
  [BlockType.CARD]: cardOutPortsAdapterV2,
  [BlockType.CARDV2]: cardV2OutPortsAdapterV2,
  [BlockType.IFV2]: ifOutPortsAdapterV2,
  [BlockType.CODE]: codeOutPortsAdapterV2,
  [BlockType.FLOW]: flowOutPortsAdapterV2,
  [BlockType.TEXT]: textOutPortsAdapterV2,
  [BlockType.TRACE]: traceOutPortsAdapterV2,
  [BlockType.SETV2]: setOutPortsAdapterV2,
  [BlockType.SPEAK]: speakOutPortsAdapterV2,
  [BlockType.VISUAL]: visualOutPortsAdapterV2,
  [BlockType.INTENT]: intentOutPortsAdapterV2,
  [BlockType.PROMPT]: promptOutPortsAdapterV2,
  [BlockType.CHOICE]: interactionOutPortsAdapterV2,
  [BlockType.RANDOM]: randomOutPortsAdapterV2,
  [BlockType.COMMAND]: commandOutPortsAdapterV2,
  [BlockType.BUTTONS]: buttonsOutPortsAdapterV2,
  [BlockType.CAPTURE]: captureOutPortsAdapterV2,
  [BlockType.COMBINED]: emptyOutPortsAdapterV2,
  [BlockType.CAPTUREV2]: captureV2OutPortsAdapterV2,
  [BlockType.COMPONENT]: componentOutPortsAdapterV2,
  [BlockType.DIRECTIVE]: directiveOutPortsAdapterV2,
  [BlockType.CHOICE_OLD]: interactionOutPortsAdapterV2,
  [BlockType.INTEGRATION]: integrationOutPortsAdapterV2,

  [BaseNode.NodeType.API]: integrationOutPortsAdapterV2,
  [BaseNode.NodeType.ZAPIER]: integrationOutPortsAdapterV2,
  [BaseNode.NodeType.GOOGLE_SHEETS]: integrationOutPortsAdapterV2,
};
