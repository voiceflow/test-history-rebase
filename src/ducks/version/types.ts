import { AlexaVersionData, AlexaVersionPublishing, AlexaVersionSettings, Locale as AlexaLocale, Voice as AlexaVoice } from '@voiceflow/alexa-types';
import { GeneralVersionData, GeneralVersionSettings, Locale as GeneralLocale, Voice as GeneralVoice } from '@voiceflow/general-types';
import {
  GoogleVersionData,
  GoogleVersionPublishing,
  GoogleVersionSettings,
  Locale as GoogleLocale,
  Voice as GoogleVoice,
} from '@voiceflow/google-types';

import { CRUDState } from '@/ducks/utils/crud';
import { Version } from '@/models';

export type AnySettings = AlexaVersionSettings | GoogleVersionSettings | GeneralVersionSettings;
export type AnyPublishing = AlexaVersionPublishing | GoogleVersionPublishing;
export type AnyPlatformData = AlexaVersionData | GoogleVersionData | GeneralVersionData;
export type AnyLocale = AlexaLocale | GoogleLocale | GeneralLocale;
export type AnyVoice = AlexaVoice | GoogleVoice | GeneralVoice;

export type AlexaVersion = Version<AlexaVersionData>;
export type GoogleVersion = Version<GoogleVersionData>;
export type GeneralVersion = Version<GeneralVersionData>;

export type AnyVersion = AlexaVersion | GoogleVersion | GeneralVersion;

export type VersionState = CRUDState<AnyVersion>;
