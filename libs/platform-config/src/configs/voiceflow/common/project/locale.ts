import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Base from '@/configs/base';

const LABEL_MAP: Record<VoiceflowConstants.Locale, string> = {
  [VoiceflowConstants.Locale.EN_US]: 'English (en-US)',
  [VoiceflowConstants.Locale.AR_AR]: 'Arabic (ar-AR)',
  [VoiceflowConstants.Locale.BG_BG]: 'Bulgarian (bg-BG)',
  [VoiceflowConstants.Locale.CA_ES]: 'Catalan (ca-ES)',
  [VoiceflowConstants.Locale.CS_CZ]: 'Czech (cs-CZ)',
  [VoiceflowConstants.Locale.ZH_CN]: 'Chinese (zh-CN)',
  [VoiceflowConstants.Locale.ZH_TW]: 'Chinese (zh-TW)',
  [VoiceflowConstants.Locale.DA_DK]: 'Danish (da-DK)',
  [VoiceflowConstants.Locale.NL_NL]: 'Dutch (nl-NL)',
  [VoiceflowConstants.Locale.NL_BE]: 'Flemish (nl-BE)',
  [VoiceflowConstants.Locale.ET_EE]: 'Estonian (et-EE)',
  [VoiceflowConstants.Locale.HE_IL]: 'Hebrew (he-IL)',
  [VoiceflowConstants.Locale.HU_HU]: 'Hungarian (hu-HU)',
  [VoiceflowConstants.Locale.FR_FR]: 'French (fr-FR)',
  [VoiceflowConstants.Locale.FR_CA]: 'French (fr-CA)',
  [VoiceflowConstants.Locale.DE_DE]: 'German (de-DE)',
  [VoiceflowConstants.Locale.GU_IN]: 'Gujarati (gu-IN)',
  [VoiceflowConstants.Locale.HI_IN]: 'Hindi (hi-IN)',
  [VoiceflowConstants.Locale.IT_IT]: 'Italian (it-IT)',
  [VoiceflowConstants.Locale.JA_JP]: 'Japanese (ja-JP)',
  [VoiceflowConstants.Locale.KO_KR]: 'Korean (ko-KR)',
  [VoiceflowConstants.Locale.MR_IN]: 'Marathi (mr-IN)',
  [VoiceflowConstants.Locale.PL_PL]: 'Polish (pl-PL)',
  [VoiceflowConstants.Locale.PT_BR]: 'Portuguese (pt-BR)',
  [VoiceflowConstants.Locale.PT_PT]: 'Portuguese (pt-PT)',
  [VoiceflowConstants.Locale.ES_ES]: 'Spanish (es-ES)',
  [VoiceflowConstants.Locale.ES_MX]: 'Spanish (es-MX)',
  [VoiceflowConstants.Locale.TA_IN]: 'Tamil (ta-IN)',
  [VoiceflowConstants.Locale.TE_IN]: 'Telugu (te-IN)',
  [VoiceflowConstants.Locale.TR_TR]: 'Turkish (tr-TR)',
  [VoiceflowConstants.Locale.RO_RO]: 'Romanian (ro-RO)',
  [VoiceflowConstants.Locale.RU_RU]: 'Russian (ru-RU)',
  [VoiceflowConstants.Locale.UK_UA]: 'Ukrainian (uk-UA)',
  [VoiceflowConstants.Locale.VI_VN]: 'Vietnamese (vi-VN)',
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
