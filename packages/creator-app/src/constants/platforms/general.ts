import { BuiltinSlot } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';

export const generalSlotTypesByLanguage = (language: string = Constants.Language.EN) =>
  Constants.SlotTypes[language]?.map<BuiltinSlot<Constants.SlotType, never>>((slot) => ({ type: slot.name, label: slot.label })) || [];

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
  [Constants.Locale.EN_US]: 'English (en-US)',
  [Constants.Locale.AR_AR]: 'Arabic (ar-AR)',
  [Constants.Locale.ZH_CN]: 'Chinese (zh-CN)',
  [Constants.Locale.NL_NL]: 'Dutch (nl-NL)',
  [Constants.Locale.FR_FR]: 'French (fr-FR)',
  [Constants.Locale.FR_CA]: 'French (fr-CA)',
  [Constants.Locale.DE_DE]: 'German (de-DE)',
  [Constants.Locale.GU_IN]: 'Gujarati (gu-IN)',
  [Constants.Locale.HI_IN]: 'Hindi (hi-IN)',
  [Constants.Locale.IT_IT]: 'Italian (it-IT)',
  [Constants.Locale.JA_JP]: 'Japanese (ja-JP)',
  [Constants.Locale.KO_KR]: 'Korean (ko-KR)',
  [Constants.Locale.MR_IN]: 'Marathi (mr-IN)',
  [Constants.Locale.PT_BR]: 'Portuguese (pt-BR)',
  [Constants.Locale.ES_ES]: 'Spanish (es-ES)',
  [Constants.Locale.ES_MX]: 'Spanish (es-MX)',
  [Constants.Locale.TA_IN]: 'Tamil (ta-IN)',
  [Constants.Locale.TE_IN]: 'Telugu (te-IN)',
  [Constants.Locale.TR_TR]: 'Turkish (tr-TR)',
};

export const GENERAL_LOCALES_OPTIONS = Object.keys(GENERAL_LOCALE_NAME_MAP).reduce<{ value: Constants.Locale; name: string }[]>(
  (acc, key) => [...acc, { value: key as Constants.Locale, name: GENERAL_LOCALE_NAME_MAP[key as Constants.Locale] }],
  []
);
