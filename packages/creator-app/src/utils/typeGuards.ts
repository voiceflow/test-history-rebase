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
  isMarkupOrCombinedBlockType,
  isPlatformWithInvocationName,
  isDiagramReferencesBlockType,
  isPlatformWithThirdPartyUpload,
} = Utils.typeGuards;
