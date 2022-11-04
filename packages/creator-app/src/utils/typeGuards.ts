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
  isLockedProjectType,
  isDialogflowPlatform,
  isRootOrMarkupBlockType,
  isVoiceflowBasedPlatform,
  isVoiceflowNLUOnlyPlatform,
  isMarkupOrCombinedBlockType,
  isPlatformWithInvocationName,
  isDiagramReferencesBlockType,
  isPlatformWithThirdPartyUpload,
} = Utils.typeGuards;
