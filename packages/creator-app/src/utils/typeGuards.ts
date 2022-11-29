import { Utils } from '@voiceflow/realtime-sdk';

export const {
  truthy,
  isAlexaPlatform,
  isRootBlockType,
  isGooglePlatform,
  isWebChatPlatform,
  isMarkupBlockType,
  isChatProjectType,
  isWhatsAppPlatform,
  isVoiceProjectType,
  isVoiceflowPlatform,
  isInternalBlockType,
  isDialogflowPlatform,
  isRootOrMarkupBlockType,
  isMarkupOrCombinedBlockType,
  isPlatformWithInvocationName,
  isDiagramReferencesBlockType,
  isPlatformWithThirdPartyUpload,
} = Utils.typeGuards;
