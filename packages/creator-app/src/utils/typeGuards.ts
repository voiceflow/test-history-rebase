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
  isVoiceProjectType,
  isChatProjectType,
  isVoiceflowPlatform,
  isPlatformWithThirdPartyUpload,
  isPlatformWithInvocationName,
  truthy,
} = Utils.typeGuards;
