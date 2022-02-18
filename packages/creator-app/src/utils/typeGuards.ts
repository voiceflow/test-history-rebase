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
  isVoicePlatform,
  isChatPlatform,
  isMobileAppPlatform,
  isDistinctPlatform,
  isAnyGeneralPlatform,
  isPlatformWithInvocationName,
  truthy,
} = Utils.typeGuards;
