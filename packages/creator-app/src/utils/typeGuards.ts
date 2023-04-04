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
  isVoiceflowNluModel,
  isInternalBlockType,
  isDialogflowPlatform,
  isRootOrMarkupBlockType,
  isMarkupOrCombinedBlockType,
} = Utils.typeGuards;
