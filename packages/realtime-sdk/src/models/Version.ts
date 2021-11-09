import { Constants as AlexaConstants, Version as AlexaVersion } from '@voiceflow/alexa-types';
import { Models as BaseModels } from '@voiceflow/base-types';
import { Version as ChatVersion } from '@voiceflow/chat-types';
import { Nullable } from '@voiceflow/common';
import { Constants as GeneralConstants, Version as GeneralVersion } from '@voiceflow/general-types';
import { Constants as DialogflowConstants, Version as DialogflowVersion } from '@voiceflow/google-dfes-types';
import { Constants as GoogleConstants, Version as GoogleVersion } from '@voiceflow/google-types';
import { Version as VoiceVersion } from '@voiceflow/voice-types';

export type DBVersion<
  P extends BaseModels.VersionPlatformData,
  C extends BaseModels.BaseCommand = BaseModels.BaseCommand,
  L extends string = string
> = BaseModels.Version<P, C, L>;

export type AnyDBVersion = AlexaVersion.AlexaVersion | GeneralVersion.GeneralVersion | GoogleVersion.GoogleVersion | ChatVersion.ChatVersion;

export interface Version<P extends BaseModels.VersionPlatformData<VoiceVersion.VoiceVersionSettings<string>, any>>
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

export type AnyVersionSettings =
  | AlexaVersion.AlexaVersionSettings
  | GoogleVersion.GoogleVersionSettings
  | GeneralVersion.GeneralVersionSettings
  | DialogflowVersion.GoogleDFESVersionSettings
  | ChatVersion.ChatVersionSettings;
export type AnyVersionPublishing =
  | AlexaVersion.AlexaVersionPublishing
  | GoogleVersion.GoogleVersionPublishing
  | DialogflowVersion.GoogleDFESVersionPublishing;
export type AnyVoiceVersionPlatformData =
  | AlexaVersion.AlexaVersionData
  | GoogleVersion.GoogleVersionData
  | GeneralVersion.GeneralVersionData
  | DialogflowVersion.GoogleDFESVersionData;
export type AnyVersionPlatformData = AnyVoiceVersionPlatformData | ChatVersion.ChatVersionData;
export type AnyLocale = AlexaConstants.Locale | GoogleConstants.Locale | GeneralConstants.Locale | DialogflowConstants.Locale;
export type AnyVoice = AlexaConstants.Voice | GoogleConstants.Voice | GeneralConstants.Voice;

export type AlexaVersion = Version<AlexaVersion.AlexaVersionData>;
export type GoogleVersion = Version<GoogleVersion.GoogleVersionData>;
export type DialogflowVersion = Version<DialogflowVersion.GoogleDFESVersionData>;
export type GeneralVersion = Version<GeneralVersion.GeneralVersionData>;

export type AnyVersion = AlexaVersion | GoogleVersion | GeneralVersion | DialogflowVersion;

export type VersionIntent<T extends BaseModels.VersionPlatformData> = T['intents'][number];

export type VersionSlot<T extends BaseModels.VersionPlatformData> = T['slots'][number];
