import { BaseNode } from '@voiceflow/base-types';

import { BlockType } from '../../../../constants';
import { emptyOutPortsAdapter, emptyOutPortsAdapterV2 } from '../utils';
import aiResponseAdapter, { aiResponseOutPortsAdapterV2 } from './aiResponse';
import aiSetAdapater, { aiSetOutPortsAdapterV2 } from './aiSet';
import { buttonsOutPortsAdapter, buttonsOutPortsAdapterV2 } from './buttons';
import { captureOutPortsAdapter, captureOutPortsAdapterV2 } from './capture';
import { captureV2OutPortsAdapter, captureV2OutPortsAdapterV2 } from './captureV2';
import cardAdapter, { cardOutPortsAdapter, cardOutPortsAdapterV2 } from './card';
import cardV2Adapter, { cardV2OutPortsAdapter, cardV2OutPortsAdapterV2 } from './cardV2';
import carouselAdapter, { carouselOutPortsAdapter, carouselOutPortsAdapterV2 } from './carousel';
import codeAdapter, { codeOutPortsAdapter, codeOutPortsAdapterV2 } from './code';
import { commandOutPortsAdapter, commandOutPortsAdapterV2 } from './command';
import componentAdapter, { componentOutPortsAdapter, componentOutPortsAdapterV2 } from './component';
import customBlockPointerAdapter, { customBlockPointerOutPortsAdapter, customBlockPointerOutPortsAdapterV2 } from './customBlockPointer';
import directiveAdapter, { directiveOutPortsAdapter, directiveOutPortsAdapterV2 } from './directive';
import exitAdapter, { exitOutPortsAdapter, exitOutPortsAdapterV2 } from './exit';
import functionAdapter, { functionOutPortsAdapterV2 } from './function';
import goToDomainAdapter, { goToDomainOutPortsAdapter, goToDomainOutPortsAdapterV2 } from './goToDomain';
import goToIntentAdapter, { goToIntentOutPortsAdapter, goToIntentOutPortsAdapterV2 } from './goToIntent';
import goToNodeAdapter, { goToNodeOutPortsAdapter, goToNodeOutPortsAdapterV2 } from './goToNode';
import ifAdapter, { ifOutPortsAdapter, ifOutPortsAdapterV2 } from './if';
import integrationAdapter, { integrationOutPortsAdapter, integrationOutPortsAdapterV2 } from './integration';
import { intentOutPortsAdapter, intentOutPortsAdapterV2 } from './intent';
import { interactionOutPortsAdapter, interactionOutPortsAdapterV2 } from './interaction';
import { promptOutPortsAdapter, promptOutPortsAdapterV2 } from './prompt';
import randomV2Adapter, { randomV2OutPortsAdapter, randomV2OutPortsAdapterV2 } from './randomV2';
import setAdapter, { setOutPortsAdapter, setOutPortsAdapterV2 } from './set';
import { speakOutPortsAdapter, speakOutPortsAdapterV2 } from './speak';
import textAdapter, { textOutPortsAdapter, textOutPortsAdapterV2 } from './text';
import traceAdapter, { traceOutPortsAdapter, traceOutPortsAdapterV2 } from './trace';
import urlAdapter, { urlOutPortsAdapter, urlOutPortsAdapterV2 } from './url';
import visualAdapter, { visualOutPortsAdapter, visualOutPortsAdapterV2 } from './visual';

// adapters unique per platform
export { default as baseButtonsAdapter } from './buttons';
export { default as baseCaptureAdapter } from './capture';
export { default as baseCaptureV2Adapter } from './captureV2';
export { default as baseCardV2Adapter } from './cardV2';
export { default as baseCarouselAdapter } from './carousel';
export { default as baseCommandAdapter } from './command';
export { default as baseIntentAdapter } from './intent';
export { default as baseInteractionAdapter } from './interaction';
export { default as basePromptAdapter } from './prompt';
export { default as baseSpeakAdapter } from './speak';

// adapters shared across all platforms
export const baseBlockAdapter = {
  // user defined
  [BlockType.URL]: urlAdapter,
  [BlockType.IFV2]: ifAdapter,
  [BlockType.TEXT]: textAdapter,
  [BlockType.EXIT]: exitAdapter,
  [BlockType.CODE]: codeAdapter,
  [BlockType.CARD]: cardAdapter,
  [BlockType.SETV2]: setAdapter,
  [BlockType.TRACE]: traceAdapter,
  [BlockType.VISUAL]: visualAdapter,
  [BlockType.CARDV2]: cardV2Adapter,
  [BlockType.AI_SET]: aiSetAdapater,
  [BlockType.RANDOMV2]: randomV2Adapter,
  [BlockType.CAROUSEL]: carouselAdapter,
  [BlockType.DIRECTIVE]: directiveAdapter,
  [BlockType.COMPONENT]: componentAdapter,
  [BlockType.GO_TO_NODE]: goToNodeAdapter,
  [BlockType.AI_RESPONSE]: aiResponseAdapter,
  [BlockType.INTEGRATION]: integrationAdapter,
  [BlockType.GO_TO_INTENT]: goToIntentAdapter,
  [BlockType.GO_TO_DOMAIN]: goToDomainAdapter,
  [BlockType.CUSTOM_BLOCK_POINTER]: customBlockPointerAdapter,
  [BlockType.FUNCTION]: functionAdapter,
};

// adapters shared across all platforms
export const baseOutPortAdapter = {
  [BlockType.IF]: ifOutPortsAdapter,
  [BlockType.SET]: setOutPortsAdapter,
  [BlockType.URL]: urlOutPortsAdapter,
  [BlockType.EXIT]: exitOutPortsAdapter,
  [BlockType.CARD]: cardOutPortsAdapter,
  [BlockType.IFV2]: ifOutPortsAdapter,
  [BlockType.CODE]: codeOutPortsAdapter,
  [BlockType.TEXT]: textOutPortsAdapter,
  [BlockType.TRACE]: traceOutPortsAdapter,
  [BlockType.SETV2]: setOutPortsAdapter,
  [BlockType.SPEAK]: speakOutPortsAdapter,
  [BlockType.VISUAL]: visualOutPortsAdapter,
  [BlockType.INTENT]: intentOutPortsAdapter,
  [BlockType.PROMPT]: promptOutPortsAdapter,
  [BlockType.CHOICE]: interactionOutPortsAdapter,
  [BlockType.RANDOMV2]: randomV2OutPortsAdapter,
  [BlockType.COMMAND]: commandOutPortsAdapter,
  [BlockType.BUTTONS]: buttonsOutPortsAdapter,
  [BlockType.CAPTURE]: captureOutPortsAdapter,
  [BlockType.ACTIONS]: emptyOutPortsAdapter,
  [BlockType.CARDV2]: cardV2OutPortsAdapter,
  [BlockType.CAROUSEL]: carouselOutPortsAdapter,
  [BlockType.COMBINED]: emptyOutPortsAdapter,
  [BlockType.CAPTUREV2]: captureV2OutPortsAdapter,
  [BlockType.COMPONENT]: componentOutPortsAdapter,
  [BlockType.DIRECTIVE]: directiveOutPortsAdapter,
  [BlockType.CHOICE_OLD]: interactionOutPortsAdapter,
  [BlockType.GO_TO_NODE]: goToNodeOutPortsAdapter,
  [BlockType.INTEGRATION]: integrationOutPortsAdapter,
  [BlockType.GO_TO_INTENT]: goToIntentOutPortsAdapter,
  [BlockType.GO_TO_DOMAIN]: goToDomainOutPortsAdapter,
  [BlockType.CUSTOM_BLOCK_POINTER]: customBlockPointerOutPortsAdapter,

  [BaseNode.NodeType.API]: integrationOutPortsAdapter,
};

// adapters shared across all platforms
export const baseOutPortAdapterV2 = {
  [BlockType.IF]: ifOutPortsAdapterV2,
  [BlockType.SET]: setOutPortsAdapterV2,
  [BlockType.URL]: urlOutPortsAdapterV2,
  [BlockType.EXIT]: exitOutPortsAdapterV2,
  [BlockType.CARD]: cardOutPortsAdapterV2,
  [BlockType.IFV2]: ifOutPortsAdapterV2,
  [BlockType.CODE]: codeOutPortsAdapterV2,
  [BlockType.TEXT]: textOutPortsAdapterV2,
  [BlockType.TRACE]: traceOutPortsAdapterV2,
  [BlockType.SETV2]: setOutPortsAdapterV2,
  [BlockType.SPEAK]: speakOutPortsAdapterV2,
  [BlockType.VISUAL]: visualOutPortsAdapterV2,
  [BlockType.INTENT]: intentOutPortsAdapterV2,
  [BlockType.PROMPT]: promptOutPortsAdapterV2,
  [BlockType.CHOICE]: interactionOutPortsAdapterV2,
  [BlockType.RANDOMV2]: randomV2OutPortsAdapterV2,
  [BlockType.COMMAND]: commandOutPortsAdapterV2,
  [BlockType.BUTTONS]: buttonsOutPortsAdapterV2,
  [BlockType.CAPTURE]: captureOutPortsAdapterV2,
  [BlockType.ACTIONS]: emptyOutPortsAdapterV2,
  [BlockType.CARDV2]: cardV2OutPortsAdapterV2,
  [BlockType.AI_SET]: aiSetOutPortsAdapterV2,
  [BlockType.CAROUSEL]: carouselOutPortsAdapterV2,
  [BlockType.COMBINED]: emptyOutPortsAdapterV2,
  [BlockType.CAPTUREV2]: captureV2OutPortsAdapterV2,
  [BlockType.COMPONENT]: componentOutPortsAdapterV2,
  [BlockType.DIRECTIVE]: directiveOutPortsAdapterV2,
  [BlockType.AI_RESPONSE]: aiResponseOutPortsAdapterV2,
  [BlockType.CHOICE_OLD]: interactionOutPortsAdapterV2,
  [BlockType.GO_TO_NODE]: goToNodeOutPortsAdapterV2,
  [BlockType.INTEGRATION]: integrationOutPortsAdapterV2,
  [BlockType.GO_TO_INTENT]: goToIntentOutPortsAdapterV2,
  [BlockType.GO_TO_DOMAIN]: goToDomainOutPortsAdapterV2,
  [BlockType.CUSTOM_BLOCK_POINTER]: customBlockPointerOutPortsAdapterV2,
  [BlockType.FUNCTION]: functionOutPortsAdapterV2,

  [BaseNode.NodeType.API]: integrationOutPortsAdapterV2,
};
