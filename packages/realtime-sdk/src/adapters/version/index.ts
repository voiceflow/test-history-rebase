import { AnyDBVersion, AnyVersion } from '@realtime-sdk/models';
import { AlexaVersion } from '@voiceflow/alexa-types';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { GoogleVersion } from '@voiceflow/google-types';
import { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

import alexaVersionAdapter from './alexa';
import googleVersionAdapter from './google';
import { DFESChatVersionAdapter, DFESVoiceVersionAdapter } from './googleDFES';
import { voiceflowChatVersionAdapter, voiceflowVoiceVersionAdapter } from './voiceflow';

const versionAdapter = createAdapter<AnyDBVersion, AnyVersion, [{ platform: VoiceflowConstants.PlatformType }]>(
  (version, { platform = VoiceflowConstants.PlatformType.ALEXA }) => {
    switch (platform) {
      case VoiceflowConstants.PlatformType.ALEXA:
        return alexaVersionAdapter.fromDB(version as AlexaVersion.Version);
      case VoiceflowConstants.PlatformType.GOOGLE:
        return googleVersionAdapter.fromDB(version as GoogleVersion.VoiceVersion);
      case VoiceflowConstants.PlatformType.CHATBOT:
        return voiceflowChatVersionAdapter.fromDB(version as VoiceflowVersion.ChatVersion);
      case VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT:
        return DFESChatVersionAdapter.fromDB(version as DFESVersion.ChatVersion);
      case VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE:
        return DFESVoiceVersionAdapter.fromDB(version as DFESVersion.VoiceVersion);
      case VoiceflowConstants.PlatformType.GENERAL:
      default:
        return voiceflowVoiceVersionAdapter.fromDB(version as VoiceflowVersion.VoiceVersion);
    }
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default versionAdapter;
