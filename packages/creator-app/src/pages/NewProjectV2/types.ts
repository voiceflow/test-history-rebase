import { AlexaConstants } from '@voiceflow/alexa-types';
import { BaseModels } from '@voiceflow/base-types';
import { Nullish } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { Icon, TippyTooltipProps, UIOnlyMenuItemOption } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export enum PlatformTypeUpcoming {
  WHATSAPP = 'whatsapp',
  FB_MESSENGER = 'fb_messenger',
  TWILIO_IVR = 'twilio_ivr',
  TWILIO_SMS = 'twilio_SMS',
  DIALOGFLOW_CX = 'dialogflow_cx',
}

export enum FileExtension {
  ZIP = '.zip',
  CSV = '.csv',
  JSON = '.json',
}

export interface ImportMeta {
  name: string;
  fileExtensions: FileExtension[];
}

export interface PlatformAndProjectTypeMeta {
  name: string;
  tooltip?: TippyTooltipProps;
  invocationDescription?: string;
  localesText?: string;
  disabled: boolean;
  type?: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType | PlatformTypeUpcoming;
  languageSelectProps?: LanguageSelectProps;
  icon?: Icon;
  iconColor?: string;
  importMeta?: ImportMeta;
}

export type AnyLanguage = GoogleConstants.Language | DFESConstants.Language | VoiceflowConstants.Locale;
export type AnyLocale = AlexaConstants.Locale;

export interface LanguageSelectOption {
  value: AnyLanguage;
  name: string;
}

export interface LanguageSelectProps {
  options: (LanguageSelectOption | UIOnlyMenuItemOption)[];
  placeholder: string;
  getOptionKey: (option: LanguageSelectOption) => string;
  getOptionValue: (option: Nullish<LanguageSelectOption>) => string | VoiceflowConstants.Locale;
  getOptionLabel: (value: Nullish<string>) => string;
  renderOptionLabel: (option: LanguageSelectOption) => string;
}

export interface Section {
  label: string;
  options: (PlatformAndProjectTypeMeta | undefined)[];
}

export interface ImportModel {
  intents: BaseModels.Intent[];
  slots: BaseModels.Slot[];
}
