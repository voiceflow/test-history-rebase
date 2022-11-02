import { AlexaConstants } from '@voiceflow/alexa-types';
import { Nullish } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { UIOnlyMenuItemOption } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export interface PlatformAndProjectMeta {
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
