import { Utils } from '@voiceflow/realtime-sdk';

export const {
  isRootBlockType,
  isMarkupBlockType,
  isInternalBlockType,
  isRootOrMarkupBlockType,
  isMarkupOrCombinedBlockType,
  isDiagramReferencesBlockType,
  isAlexaPlatform,
  isGooglePlatform,
  isIVRPlatform,
  isGeneralPlatform,
  isChatbotPlatform,
  isMobileAppPlatform,
  isDistinctPlatform,
  isAnyGeneralPlatform,
  truthy,
} = Utils.typeGuards;
