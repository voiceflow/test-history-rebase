import { Constants as AlexaConstants, Version as AlexaVersion } from '@voiceflow/alexa-types';
import { Constants as GeneralConstants, Version as GeneralVersion } from '@voiceflow/general-types';
import { Constants as GoogleConstants, Version as GoogleVersion } from '@voiceflow/google-types';

import { CRUDState } from '@/ducks/utils/crud';
import { Version } from '@/models';

export type AnySettings = AlexaVersion.AlexaVersionSettings | GoogleVersion.GoogleVersionSettings | GeneralVersion.GeneralVersionSettings;
export type AnyPublishing = AlexaVersion.AlexaVersionPublishing | GoogleVersion.GoogleVersionPublishing;
export type AnyPlatformData = AlexaVersion.AlexaVersionData | GoogleVersion.GoogleVersionData | GeneralVersion.GeneralVersionData;
export type AnyLocale = AlexaConstants.Locale | GoogleConstants.Locale | GeneralConstants.Locale;
export type AnyVoice = AlexaConstants.Voice | GoogleConstants.Voice | GeneralConstants.Voice;

export type AlexaVersion = Version<AlexaVersion.AlexaVersionData>;
export type GoogleVersion = Version<GoogleVersion.GoogleVersionData>;
export type GeneralVersion = Version<GeneralVersion.GeneralVersionData>;

export type AnyVersion = AlexaVersion | GoogleVersion | GeneralVersion;

export type VersionState = CRUDState<AnyVersion>;
