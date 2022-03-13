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
  isDistinctPlatform,
  isVoiceflowPlatform,
  isPlatformWithInvocationName,
  truthy,
} = Utils.typeGuards;
