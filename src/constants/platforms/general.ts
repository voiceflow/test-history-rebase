import { Locale, SlotTypes } from '@voiceflow/general-types';

export const GENERAL_SLOT_TYPES = Object.keys(SlotTypes).reduce<Record<string, { label: string; value: string }[]>>((acc, language) => {
  acc[language] = SlotTypes[language].map((slot) => ({ label: slot.label, value: slot.name }));
  return acc;
}, {});

export enum GeneralStageType {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  PROGRESS = 'PROGRESS',
}

export enum GeneralJobErrorType {
  RENDERING = 'RENDERING',
}

export enum GeneralJobSuccessType {
  SUCCESS = 'SUCCESS',
  DOWNLOAD = 'DOWNLOAD',
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

export enum NLPTrainJobSuccessType {
  PUBLISH = 'PUBLISH',
}

export const GENERAL_LOCALE_NAME_MAP = {
  [Locale.EN_US]: 'English (en-US)',
  [Locale.AR_AR]: 'Arabic (ar-AR)',
  [Locale.ZH_CN]: 'Chinese (zh-CN)',
  [Locale.NL_NL]: 'Dutch (nl-NL)',
  [Locale.FR_FR]: 'French (fr-FR)',
  [Locale.FR_CA]: 'French (fr-CA)',
  [Locale.DE_DE]: 'German (de-DE)',
  [Locale.GU_IN]: 'Gujarati (gu-IN)',
  [Locale.HI_IN]: 'Hindi (hi-IN)',
  [Locale.IT_IT]: 'Italian (it-IT)',
  [Locale.JA_JP]: 'Japanese (ja-JP)',
  [Locale.KO_KR]: 'Korean (ko-KR)',
  [Locale.MR_IN]: 'Marathi (mr-IN)',
  [Locale.PT_BR]: 'Portuguese (pt-BR)',
  [Locale.ES_ES]: 'Spanish (es-ES)',
  [Locale.ES_MX]: 'Spanish (es-MX)',
  [Locale.TA_IN]: 'Tamil (ta-IN)',
  [Locale.TE_IN]: 'Telugu (te-IN)',
  [Locale.TR_TR]: 'Turkish (tr-TR)',
};

export const GENERAL_LOCALES_OPTIONS = Object.keys(GENERAL_LOCALE_NAME_MAP).reduce<{ value: Locale; name: string }[]>(
  (acc, key) => [...acc, { value: key as Locale, name: GENERAL_LOCALE_NAME_MAP[key as Locale] }],
  []
);
