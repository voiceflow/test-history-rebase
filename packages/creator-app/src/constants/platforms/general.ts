import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export enum GeneralStageType {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  PROGRESS = 'PROGRESS',
}

export enum GeneralJobErrorType {
  RENDERING = 'RENDERING',
}

export enum NLPTrainStageType {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  PROGRESS = 'PROGRESS',
}

export enum NLPTrainJobErrorType {
  TRAINING = 'TRAINING',
  COMPILING = 'COMPILING',
  UPLOADING = 'UPLOADING',
  PUBLISHING = 'PUBLISHING',
}

export const GENERAL_LOCALE_NAME_MAP = {
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

export const GENERAL_LOCALES_OPTIONS = Object.keys(GENERAL_LOCALE_NAME_MAP).reduce<{ value: VoiceflowConstants.Locale; name: string }[]>(
  (acc, key) => [...acc, { value: key as VoiceflowConstants.Locale, name: GENERAL_LOCALE_NAME_MAP[key as VoiceflowConstants.Locale] }],
  []
);
