import { Utils } from '@voiceflow/realtime-sdk';

export const {
  truthy,
  isAlexaPlatform,
  isRootBlockType,
  isGooglePlatform,
  isMarkupBlockType,
  isChatProjectType,
  isVoiceProjectType,
  isVoiceflowPlatform,
  isInternalBlockType,
  isDialogflowPlatform,
  isRootOrMarkupBlockType,
  isOneClickChannelPlatform,
  isMarkupOrCombinedBlockType,
  isPlatformWithInvocationName,
  isDiagramReferencesBlockType,
  isPlatformWithThirdPartyUpload,
} = Utils.typeGuards;
