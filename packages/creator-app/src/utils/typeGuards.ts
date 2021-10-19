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
  isDialogflowPlatform,
  isDialogflowChatPlatform,
  isDialogflowVoicePlatform,
  isIVRPlatform,
  isGeneralPlatform,
  isChatbotPlatform,
  isMobileAppPlatform,
  isDistinctPlatform,
  isAnyGeneralPlatform,
  isPlatformWithInvocationName,
  truthy,
} = Utils.typeGuards;
