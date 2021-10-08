import { Constants } from '@voiceflow/general-types';

import {
  BlockType,
  DIAGRAM_REFERENCE_NODES,
  DIALOGFLOW_PLATFORMS,
  DISTINCT_PLATFORMS,
  GENERAL_PLATFORMS,
  INTERNAL_NODES,
  MARKUP_AND_COMBINED_NODES,
  MARKUP_NODES,
  ROOT_AND_MARKUP_NODES,
  ROOT_NODES,
} from '../constants';

const createBlockTypeGuard =
  <R extends BlockType>(nodes: ReadonlyArray<R>) =>
  (type: BlockType): type is R =>
    nodes.includes(type as R);
const createPlatformTypeGuard =
  <R extends Constants.PlatformType>(platform: R) =>
  (type?: string | Constants.PlatformType | null): type is R =>
    type === platform;

export const isRootBlockType = createBlockTypeGuard(ROOT_NODES);
export const isMarkupBlockType = createBlockTypeGuard(MARKUP_NODES);
export const isInternalBlockType = createBlockTypeGuard(INTERNAL_NODES);
export const isRootOrMarkupBlockType = createBlockTypeGuard(ROOT_AND_MARKUP_NODES);
export const isMarkupOrCombinedBlockType = createBlockTypeGuard(MARKUP_AND_COMBINED_NODES);
export const isDiagramReferencesBlockType = createBlockTypeGuard(DIAGRAM_REFERENCE_NODES);

export const isAlexaPlatform = createPlatformTypeGuard(Constants.PlatformType.ALEXA);
export const isGooglePlatform = createPlatformTypeGuard(Constants.PlatformType.GOOGLE);

export const isIVRPlatform = createPlatformTypeGuard(Constants.PlatformType.IVR);
export const isGeneralPlatform = createPlatformTypeGuard(Constants.PlatformType.GENERAL);
export const isChatbotPlatform = createPlatformTypeGuard(Constants.PlatformType.CHATBOT);
export const isMobileAppPlatform = createPlatformTypeGuard(Constants.PlatformType.MOBILE_APP);

export const isDialogflowPlatform = (type: string | Constants.PlatformType): type is typeof DIALOGFLOW_PLATFORMS[number] =>
  DIALOGFLOW_PLATFORMS.includes(type as typeof DIALOGFLOW_PLATFORMS[number]);

export const isDistinctPlatform = (type: string | Constants.PlatformType): type is typeof DISTINCT_PLATFORMS[number] =>
  DISTINCT_PLATFORMS.includes(type as typeof DISTINCT_PLATFORMS[number]);

export const isAnyGeneralPlatform = (type: string | Constants.PlatformType): type is typeof GENERAL_PLATFORMS[number] =>
  GENERAL_PLATFORMS.includes(type as typeof GENERAL_PLATFORMS[number]);

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;
export const truthy = <T>(value: T): value is Truthy<T> => Boolean(value);
