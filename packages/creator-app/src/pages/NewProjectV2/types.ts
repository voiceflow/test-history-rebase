import { AlexaConstants } from '@voiceflow/alexa-types';
import { BaseModels } from '@voiceflow/base-types';
import { Nullish } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { SvgIconTypes, TippyTooltipProps, UIOnlyMenuItemOption } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export enum PlatformTypeUpcoming {
  WHATSAPP = 'whatsapp',
  TWILIO_IVR = 'twilio_ivr',
  TWILIO_SMS = 'twilio_SMS',
  FB_MESSENGER = 'fb_messenger',
  DIALOGFLOW_CX = 'upcoming-df-cx',
}

export enum FileExtension {
  ZIP = '.zip',
  CSV = '.csv',
  XML = '.xml',
  JSON = '.json',
}

export interface ImportMeta {
  name: string;
  fileExtensions: FileExtension[];
}

export type DeprecatedPlatforms =
  | VoiceflowConstants.PlatformType.IVR
  | VoiceflowConstants.PlatformType.CHATBOT
  | VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT
  | VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE
  | VoiceflowConstants.PlatformType.GENERAL
  | VoiceflowConstants.PlatformType.MOBILE_APP;

export type SupportedPlatformType = Exclude<VoiceflowConstants.PlatformType, DeprecatedPlatforms>;
export type SupportedPlatformProjectType = SupportedPlatformType | VoiceflowConstants.ProjectType;
export type PlatformAndProjectMetaType = SupportedPlatformProjectType | PlatformTypeUpcoming;

export interface PlatformAndProjectMeta {
  type: PlatformAndProjectMetaType;
  icon?: SvgIconTypes.Icon;
  name: string;
  tooltip?: TippyTooltipProps;
  disabled?: boolean;
  iconColor?: string;
  importMeta?: ImportMeta;
  localesText?: string;
  languageSelectProps?: LanguageSelectProps;
  invocationDescription?: string;
}

export type AnyLanguage = GoogleConstants.Language | DFESConstants.Language | VoiceflowConstants.Locale;
export type AnyLocale = AlexaConstants.Locale;

export interface LanguageSelectOption {
  value: AnyLanguage;
  name: string;
}

export interface LanguageSelectProps {
  options: Array<LanguageSelectOption | UIOnlyMenuItemOption>;
  placeholder: string;
  getOptionKey: (option: LanguageSelectOption) => string;
  getOptionValue: (option: Nullish<LanguageSelectOption>) => string | VoiceflowConstants.Locale;
  getOptionLabel: (value: Nullish<string>) => string;
  renderOptionLabel: (option: LanguageSelectOption) => string;
}

export interface ImportModel {
  slots: BaseModels.Slot[];
  intents: BaseModels.Intent[];
}
