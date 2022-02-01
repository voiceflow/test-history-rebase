import {
  BlockType,
  CHAT_PLATFORMS,
  DIAGRAM_REFERENCE_NODES,
  DIALOGFLOW_PLATFORMS,
  DISTINCT_PLATFORMS,
  GENERAL_PLATFORMS,
  INTERNAL_NODES,
  MARKUP_AND_COMBINED_NODES,
  MARKUP_NODES,
  PLATFORMS_WITH_INVOCATION_NAME,
  ROOT_AND_MARKUP_NODES,
  ROOT_NODES,
  VOICE_PLATFORMS,
} from '@realtime-sdk/constants';
import { Constants } from '@voiceflow/general-types';

const createBlockTypeGuard =
  <R extends BlockType>(nodes: ReadonlyArray<R>) =>
  (type: BlockType): type is R =>
    nodes.includes(type as R);

const createPlatformTypeGuard =
  <R extends Constants.PlatformType>(platform: R) =>
  (type?: string | Constants.PlatformType | null): type is R =>
    type === platform;

const createPlatformUnionTypeGuard =
  <R extends Constants.PlatformType>(platforms: R[] | ReadonlyArray<R>) =>
  (type?: string | Constants.PlatformType | null): type is R =>
    !!type && platforms.includes(type as R);

export const isRootBlockType = createBlockTypeGuard(ROOT_NODES);
export const isMarkupBlockType = createBlockTypeGuard(MARKUP_NODES);
export const isInternalBlockType = createBlockTypeGuard(INTERNAL_NODES);
export const isRootOrMarkupBlockType = createBlockTypeGuard(ROOT_AND_MARKUP_NODES);
export const isMarkupOrCombinedBlockType = createBlockTypeGuard(MARKUP_AND_COMBINED_NODES);
export const isDiagramReferencesBlockType = createBlockTypeGuard(DIAGRAM_REFERENCE_NODES);

export const isAlexaPlatform = createPlatformTypeGuard(Constants.PlatformType.ALEXA);
export const isGooglePlatform = createPlatformTypeGuard(Constants.PlatformType.GOOGLE);
export const isDialogflowChatPlatform = createPlatformTypeGuard(Constants.PlatformType.DIALOGFLOW_ES_CHAT);
export const isDialogflowVoicePlatform = createPlatformTypeGuard(Constants.PlatformType.DIALOGFLOW_ES_VOICE);

export const isIVRPlatform = createPlatformTypeGuard(Constants.PlatformType.IVR);
export const isGeneralPlatform = createPlatformTypeGuard(Constants.PlatformType.GENERAL);
export const isChatbotPlatform = createPlatformTypeGuard(Constants.PlatformType.CHATBOT);
export const isMobileAppPlatform = createPlatformTypeGuard(Constants.PlatformType.MOBILE_APP);

export const isVoicePlatform = createPlatformUnionTypeGuard(VOICE_PLATFORMS);
export const isChatPlatform = createPlatformUnionTypeGuard(CHAT_PLATFORMS);
export const isDistinctPlatform = createPlatformUnionTypeGuard(DISTINCT_PLATFORMS);
export const isDialogflowPlatform = createPlatformUnionTypeGuard(DIALOGFLOW_PLATFORMS);
export const isAnyGeneralPlatform = createPlatformUnionTypeGuard(GENERAL_PLATFORMS);
export const isPlatformWithInvocationName = createPlatformUnionTypeGuard(PLATFORMS_WITH_INVOCATION_NAME);

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;

export const truthy = <T>(value: T): value is Truthy<T> => Boolean(value);
