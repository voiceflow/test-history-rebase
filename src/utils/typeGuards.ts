import {
  BlockType,
  DIAGRAM_REFERENCE_NODES,
  DISTINCT_PLATFORMS,
  GENERAL_PLATFORMS,
  INTERNAL_NODES,
  MARKUP_AND_COMBINED_NODES,
  MARKUP_NODES,
  PlatformType,
  ROOT_AND_MARKUP_NODES,
  ROOT_NODES,
} from '@/constants';

const createBlockTypeGuard = <R extends BlockType>(nodes: ReadonlyArray<R>) => (type: BlockType): type is R => nodes.includes(type as R);
const createPlatformTypeGuard = <R extends PlatformType>(platform: R) => (type: string | PlatformType): type is R => type === platform;

export const isRootBlockType = createBlockTypeGuard(ROOT_NODES);
export const isMarkupBlockType = createBlockTypeGuard(MARKUP_NODES);
export const isInternalBlockType = createBlockTypeGuard(INTERNAL_NODES);
export const isRootOrMarkupBlockType = createBlockTypeGuard(ROOT_AND_MARKUP_NODES);
export const isMarkupOrCombinedBlockType = createBlockTypeGuard(MARKUP_AND_COMBINED_NODES);
export const isDiagramReferencesBlockType = createBlockTypeGuard(DIAGRAM_REFERENCE_NODES);

export const isAlexaPlatform = createPlatformTypeGuard(PlatformType.ALEXA);
export const isGooglePlatform = createPlatformTypeGuard(PlatformType.GOOGLE);

export const isIVRPlatform = createPlatformTypeGuard(PlatformType.IVR);
export const isGeneralPlatform = createPlatformTypeGuard(PlatformType.GENERAL);
export const isChatbotPlatform = createPlatformTypeGuard(PlatformType.CHATBOT);
export const isMobileAppPlatform = createPlatformTypeGuard(PlatformType.MOBILE_APP);

export const isDistinctPlatform = (type: string | PlatformType): type is typeof DISTINCT_PLATFORMS[number] =>
  DISTINCT_PLATFORMS.includes(type as typeof DISTINCT_PLATFORMS[number]);

export const isAnyGeneralPlatform = (type: string | PlatformType): type is typeof GENERAL_PLATFORMS[number] =>
  GENERAL_PLATFORMS.includes(type as typeof GENERAL_PLATFORMS[number]);
