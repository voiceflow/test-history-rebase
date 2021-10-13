import { Constants as AlexaConstants, Version as AlexaVersion } from '@voiceflow/alexa-types';
import { Version as DBVersion, VersionPlatformData } from '@voiceflow/api-sdk';
import { Constants as GeneralConstants, Version as GeneralVersion } from '@voiceflow/general-types';
import { Constants as DialogflowConstants, Version as DialogflowVersion } from '@voiceflow/google-dfes-types';
import { Constants as GoogleConstants, Version as GoogleVersion } from '@voiceflow/google-types';
import { Version as VoiceVersion } from '@voiceflow/voice-types';

import { Nullable } from '../types';

export { DBVersion };

export interface Version<P extends VersionPlatformData<VoiceVersion.VoiceVersionSettings<string>, any>>
  extends Pick<DBVersion<P>, 'creatorID' | 'variables' | 'projectID' | 'rootDiagramID'>,
    Required<Pick<DBVersion<P>, 'folders' | 'topics' | 'components'>> {
  id: string;
  status: Nullable<P['status']>;
  session: Nullable<Version.Session>;
  settings: Omit<P['settings'], 'session'>;
  publishing: P['publishing'];
}

export namespace Version {
  export interface Session {
    restart: boolean;
    resumePrompt: {
      voice: Nullable<string>;
      content: string;
      followVoice: Nullable<string>;
      followContent: Nullable<string>;
    };
  }
}

export type AnySettings =
  | AlexaVersion.AlexaVersionSettings
  | GoogleVersion.GoogleVersionSettings
  | GeneralVersion.GeneralVersionSettings
  | DialogflowVersion.GoogleDFESVersionSettings;
export type AnyPublishing =
  | AlexaVersion.AlexaVersionPublishing
  | GoogleVersion.GoogleVersionPublishing
  | DialogflowVersion.GoogleDFESVersionPublishing;
export type AnyPlatformData =
  | AlexaVersion.AlexaVersionData
  | GoogleVersion.GoogleVersionData
  | GeneralVersion.GeneralVersionData
  | DialogflowVersion.GoogleDFESVersionData;
export type AnyLocale = AlexaConstants.Locale | GoogleConstants.Locale | GeneralConstants.Locale | DialogflowConstants.Locale;
export type AnyVoice = AlexaConstants.Voice | GoogleConstants.Voice | GeneralConstants.Voice;

export type AlexaVersion = Version<AlexaVersion.AlexaVersionData>;
export type GoogleVersion = Version<GoogleVersion.GoogleVersionData>;
export type DialogflowVersion = Version<DialogflowVersion.GoogleDFESVersionData>;
export type GeneralVersion = Version<GeneralVersion.GeneralVersionData>;

export type AnyVersion = AlexaVersion | GoogleVersion | GeneralVersion | DialogflowVersion;
