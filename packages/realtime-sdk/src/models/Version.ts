import { AlexaConstants, AlexaVersion } from '@voiceflow/alexa-types';
import { BaseModels } from '@voiceflow/base-types';
import { ChatVersion } from '@voiceflow/chat-types';
import { Nullable } from '@voiceflow/common';
import { DFESConstants, DFESVersion } from '@voiceflow/google-dfes-types';
import { GoogleConstants, GoogleVersion } from '@voiceflow/google-types';
import { VoiceVersion } from '@voiceflow/voice-types';
import { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';

export type DBVersion<
  P extends BaseModels.Version.PlatformData,
  C extends BaseModels.BaseCommand = BaseModels.BaseCommand,
  L extends string = string
> = BaseModels.Version.Model<P, C, L>;

export type AnyDBVersion = AlexaVersion.Version | VoiceflowVersion.Version | GoogleVersion.VoiceVersion | DFESVersion.Version;

export interface BaseVersionPlatformData extends BaseModels.Version.PlatformData<VoiceVersion.Settings<string> | ChatVersion.Settings, any> {
  status?: any;
}

export interface Version<P extends BaseVersionPlatformData>
  extends Pick<DBVersion<P>, 'creatorID' | '_version' | 'variables' | 'projectID' | 'rootDiagramID' | 'templateDiagramID' | 'defaultStepColors'>,
    Required<Pick<DBVersion<P>, 'folders' | 'components'>> {
  id: string;
  status: Nullable<P['status']>;
  session: Nullable<Version.Session>;
  settings: Omit<P['settings'], 'session'>;
  publishing: P['publishing'];

  /**
   * @deprecated should be removed when domains are released
   */
  topics: BaseModels.Version.FolderItem[];
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

  export type DefaultStepColors = BaseModels.Version.DefaultStepColors;
}

export type AnyVoiceVersionSettings =
  | AlexaVersion.Settings
  | DFESVersion.VoiceSettings
  | GoogleVersion.VoiceSettings
  | VoiceflowVersion.VoiceSettings;

export type AnyChatVersionSettings = DFESVersion.ChatSettings | VoiceflowVersion.ChatSettings;

export type AnyVersionSettings = AnyVoiceVersionSettings | AnyChatVersionSettings;

export type AnyVoiceVersionPublishing = AlexaVersion.Publishing | DFESVersion.VoicePublishing | GoogleVersion.VoicePublishing;

export type AnyChatVersionPublishing = DFESVersion.ChatPublishing;

export type AnyVersionPublishing = AnyVoiceVersionPublishing | AnyChatVersionPublishing;

export type AnyVoiceVersionPlatformData =
  | AlexaVersion.PlatformData
  | DFESVersion.VoicePlatformData
  | GoogleVersion.VoicePlatformData
  | VoiceflowVersion.VoicePlatformData;

export type AnyChatVersionPlatformData = AlexaVersion.PlatformData | DFESVersion.ChatPlatformData | VoiceflowVersion.ChatPlatformData;

export type AnyVersionPlatformData = AnyVoiceVersionPlatformData | AnyChatVersionPlatformData;

export type AnyLocale = AlexaConstants.Locale | GoogleConstants.Locale | VoiceflowConstants.Locale | DFESConstants.Locale;
export type AnyVoice = AlexaConstants.Voice | GoogleConstants.Voice | VoiceflowConstants.Voice;

export type AlexaVersion = Version<AlexaVersion.PlatformData>;
export type GoogleVersion = Version<GoogleVersion.VoicePlatformData>;
export type VoiceflowVersion = Version<VoiceflowVersion.PlatformData>;
export type VoiceflowChatVersion = Version<VoiceflowVersion.ChatPlatformData>;
export type DialogflowVersion = Version<DFESVersion.PlatformData>;

export type AnyVersion = AlexaVersion | GoogleVersion | VoiceflowVersion | DialogflowVersion;

export type VersionIntent<T extends BaseModels.Version.PlatformData> = T['intents'][number];

export type VersionSlot<T extends BaseModels.Version.PlatformData> = T['slots'][number];
