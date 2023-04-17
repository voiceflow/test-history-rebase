import * as Base from '@platform-config/configs/base';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

const LABEL_MAP: Record<VoiceflowConstants.Locale, string> = {
  [VoiceflowConstants.Locale.EN_US]: 'English (en-US)',
  [VoiceflowConstants.Locale.AR_AR]: 'Arabic (ar-AR)',
  [VoiceflowConstants.Locale.ZH_CN]: 'Chinese (zh-CN)',
  [VoiceflowConstants.Locale.NL_NL]: 'Dutch (nl-NL)',
  [VoiceflowConstants.Locale.FR_FR]: 'French (fr-FR)',
  [VoiceflowConstants.Locale.FR_CA]: 'French (fr-CA)',
  [VoiceflowConstants.Locale.DE_DE]: 'German (de-DE)',
  [VoiceflowConstants.Locale.GU_IN]: 'Gujarati (gu-IN)',
  [VoiceflowConstants.Locale.HI_IN]: 'Hindi (hi-IN)',
  [VoiceflowConstants.Locale.IT_IT]: 'Italian (it-IT)',
  [VoiceflowConstants.Locale.JA_JP]: 'Japanese (ja-JP)',
  [VoiceflowConstants.Locale.KO_KR]: 'Korean (ko-KR)',
  [VoiceflowConstants.Locale.MR_IN]: 'Marathi (mr-IN)',
  [VoiceflowConstants.Locale.PT_BR]: 'Portuguese (pt-BR)',
  [VoiceflowConstants.Locale.ES_ES]: 'Spanish (es-ES)',
  [VoiceflowConstants.Locale.ES_MX]: 'Spanish (es-MX)',
  [VoiceflowConstants.Locale.TA_IN]: 'Tamil (ta-IN)',
  [VoiceflowConstants.Locale.TE_IN]: 'Telugu (te-IN)',
  [VoiceflowConstants.Locale.TR_TR]: 'Turkish (tr-TR)',
};

export const CONFIG = Base.Project.Locale.extend({
  enum: VoiceflowConstants.Locale,

  list: Object.values(VoiceflowConstants.Locale),

  multi: false,

  storedIn: 'settings',

  labelMap: LABEL_MAP,

  isLanguage: false,

  defaultLocales: [VoiceflowConstants.Locale.EN_US],

  preferredLocales: [VoiceflowConstants.Locale.EN_US],

  utteranceRecommendations: [VoiceflowConstants.Locale.EN_US],
})(Base.Project.Locale.validate);

export type Config = typeof CONFIG;
