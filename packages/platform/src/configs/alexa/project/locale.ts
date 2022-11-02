import * as Base from '@platform/configs/base';
import { AlexaConstants } from '@voiceflow/alexa-types';

export const LABEL_MAP: Record<AlexaConstants.Locale, string> = {
  [AlexaConstants.Locale.EN_US]: 'English (US)',
  [AlexaConstants.Locale.EN_GB]: 'English (UK)',
  [AlexaConstants.Locale.DE_DE]: 'German (DE)',
  [AlexaConstants.Locale.JA_JP]: 'Japanese (JP)',
  [AlexaConstants.Locale.ES_US]: 'Spanish (US)',
  [AlexaConstants.Locale.ES_ES]: 'Spanish (ES)',
  [AlexaConstants.Locale.FR_FR]: 'French (FR)',
  [AlexaConstants.Locale.IT_IT]: 'Italian (IT)',
  [AlexaConstants.Locale.EN_AU]: 'English (AU)',
  [AlexaConstants.Locale.EN_CA]: 'English (CA)',
  [AlexaConstants.Locale.EN_IN]: 'English (IN)',
  [AlexaConstants.Locale.ES_MX]: 'Spanish (MX)',
  [AlexaConstants.Locale.FR_CA]: 'French (CA)',
  [AlexaConstants.Locale.PT_BR]: 'Portuguese (BR)',
  [AlexaConstants.Locale.HI_IN]: 'Hindi (IN)',
};

export const DEFAULT_LOCALE = [AlexaConstants.Locale.EN_US];

export const CONFIG = Base.Project.Locale.extend({
  enum: AlexaConstants.Locale,
  list: Object.values(AlexaConstants.Locale),
  multi: true,
  language: false,
  labelMap: LABEL_MAP,
  defaultLocale: DEFAULT_LOCALE,
});

export type Config = typeof CONFIG;
