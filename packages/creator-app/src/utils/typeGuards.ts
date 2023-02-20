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
  isSMSPlatform,
  isMicrosoftTeamsPlatform,
  isVoiceProjectType,
  isVoiceflowPlatform,
  isVoiceflowNluModel,
  isInternalBlockType,
  isDialogflowPlatform,
  isRootOrMarkupBlockType,
  isMarkupOrCombinedBlockType,
  isPlatformWithInvocationName,
  isPlatformWithThirdPartyUpload,
} = Utils.typeGuards;
