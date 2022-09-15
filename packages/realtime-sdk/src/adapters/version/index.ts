import { AnyDBVersion, AnyVersion } from '@realtime-sdk/models';
import { typeGuards } from '@realtime-sdk/utils';
import { AlexaVersion } from '@voiceflow/alexa-types';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { GoogleVersion } from '@voiceflow/google-types';
import { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import alexaVersionAdapter from './alexa';
import googleVersionAdapter from './google';
import { DFESChatVersionAdapter, DFESVoiceVersionAdapter } from './googleDFES';
import { voiceflowChatVersionAdapter, voiceflowVoiceVersionAdapter } from './voiceflow';

const versionAdapter = createMultiAdapter<
  AnyDBVersion,
  AnyVersion,
  [{ platform: VoiceflowConstants.PlatformType; projectType: VoiceflowConstants.ProjectType }]
>((version, { platform = VoiceflowConstants.PlatformType.ALEXA, projectType }) => {
  switch (platform) {
    case VoiceflowConstants.PlatformType.ALEXA:
      return alexaVersionAdapter.fromDB(version as AlexaVersion.Version);
    case VoiceflowConstants.PlatformType.GOOGLE:
      return googleVersionAdapter.fromDB(version as GoogleVersion.VoiceVersion);
    case VoiceflowConstants.PlatformType.DIALOGFLOW_ES:
      return typeGuards.isChatProjectType(projectType)
        ? DFESChatVersionAdapter.fromDB(version as DFESVersion.ChatVersion)
        : DFESVoiceVersionAdapter.fromDB(version as DFESVersion.VoiceVersion);
    case VoiceflowConstants.PlatformType.VOICEFLOW:
    default:
      return typeGuards.isChatProjectType(projectType)
        ? voiceflowChatVersionAdapter.fromDB(version as VoiceflowVersion.ChatVersion)
        : voiceflowVoiceVersionAdapter.fromDB(version as VoiceflowVersion.VoiceVersion);
  }
}, notImplementedAdapter.transformer);

export default versionAdapter;
