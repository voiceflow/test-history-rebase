import { AnyDBVersion, AnyVersion } from '@realtime-sdk/models';
import { Version as AlexaVersion } from '@voiceflow/alexa-types';
import { Version as ChatVersion } from '@voiceflow/chat-types';
import { Constants, Version as GeneralVersion } from '@voiceflow/general-types';
import { Version as GoogleDFVersion } from '@voiceflow/google-dfes-types';
import { Version as GoogleVersion } from '@voiceflow/google-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

import alexaVersionAdapter from './alexa';
import chatVersionAdapter from './chat';
import generalVersionAdapter from './general';
import googleVersionAdapter from './google';
import googleDFChatVersionAdapter from './googleDF_chat';
import googleDFVoiceVersionAdapter from './googleDF_voice';

const versionAdapter = createAdapter<AnyDBVersion, AnyVersion, [{ platform: Constants.PlatformType }]>(
  (version, { platform = Constants.PlatformType.ALEXA }) => {
    switch (platform) {
      case Constants.PlatformType.ALEXA:
        return alexaVersionAdapter.fromDB(version as AlexaVersion.AlexaVersion);
      case Constants.PlatformType.GOOGLE:
        return googleVersionAdapter.fromDB(version as GoogleVersion.GoogleVersion);
      case Constants.PlatformType.CHATBOT:
        return chatVersionAdapter.fromDB(version as ChatVersion.ChatVersion);
      case Constants.PlatformType.DIALOGFLOW_ES_CHAT:
        return googleDFChatVersionAdapter.fromDB(version as GoogleDFVersion.GoogleDFESVersion);
      case Constants.PlatformType.DIALOGFLOW_ES_VOICE:
        return googleDFVoiceVersionAdapter.fromDB(version as GoogleDFVersion.GoogleDFESVersion);
      case Constants.PlatformType.GENERAL:
      default:
        return generalVersionAdapter.fromDB(version as GeneralVersion.GeneralVersion);
    }
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default versionAdapter;
