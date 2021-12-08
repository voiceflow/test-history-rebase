import { Constants as GeneralConstants } from '@voiceflow/general-types';
import { Constants as DialogflowConstants } from '@voiceflow/google-dfes-types';
import { Constants as GoogleConstants } from '@voiceflow/google-types';

import {
  AlexaExportJob,
  AlexaPublishJob,
  DialogflowExportJob,
  DialogflowPublishJob,
  GeneralJob,
  GoogleExportJob,
  GooglePublishJob,
  JobStageData,
} from '@/models';
import { FORMATTED_DIALOGFLOW_LOCALES_LABELS } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS } from '@/pages/Publish/Google/utils';
import LOCALE_MAP from '@/services/LocaleMap';
import { createPlatformSelector } from '@/utils/platform';

import { AlexaPublishJobErrorType, AlexaStageType } from './alexa';
import { DialogflowPublishJobErrorType, DialogflowStageType } from './dialogflow';
import { GENERAL_LOCALE_NAME_MAP } from './general';
import { GooglePublishJobErrorType, GoogleStageType } from './google';

const AnyPublishJobRenderingError = [GooglePublishJobErrorType.RENDERING, AlexaPublishJobErrorType.RENDERING, GooglePublishJobErrorType.RENDERING];
const AnyPublishJobSubmittingReviewError = [
  GooglePublishJobErrorType.SUBMITTING_FOR_REVIEW,
  AlexaPublishJobErrorType.SUBMITTING_FOR_REVIEW,
  GooglePublishJobErrorType.SUBMITTING_FOR_REVIEW,
];
const AnyPublishJobSubmittingProjectError = [
  GooglePublishJobErrorType.SUBMITTING_PROJECT,
  AlexaPublishJobErrorType.SUBMITTING_PROJECT,
  GooglePublishJobErrorType.SUBMITTING_PROJECT,
];

export const IsPublishJobRenderingError = (type: string): type is typeof AnyPublishJobRenderingError[number] =>
  AnyPublishJobRenderingError.includes(type as typeof AnyPublishJobRenderingError[number]);

export const isPublishJobSubmittingReviewError = (type: string): type is typeof AnyPublishJobSubmittingReviewError[number] =>
  AnyPublishJobSubmittingReviewError.includes(type as typeof AnyPublishJobSubmittingReviewError[number]);

export const isPublishJobSubmittingProjectError = (type: string): type is typeof AnyPublishJobSubmittingProjectError[number] =>
  AnyPublishJobSubmittingProjectError.includes(type as typeof AnyPublishJobSubmittingProjectError[number]);

export type AnyErrorStageData =
  | JobStageData<GoogleExportJob.ErrorStage>
  | JobStageData<GooglePublishJob.ErrorStage>
  | JobStageData<DialogflowPublishJob.ErrorStage>
  | JobStageData<DialogflowExportJob.ErrorStage>
  | JobStageData<AlexaExportJob.ErrorStage>
  | JobStageData<AlexaPublishJob.ErrorStage>
  | JobStageData<GeneralJob.ErrorStage>;

export type AnyErrorStage =
  | GoogleExportJob.ErrorStage
  | GooglePublishJob.ErrorStage
  | DialogflowPublishJob.ErrorStage
  | DialogflowExportJob.ErrorStage
  | AlexaExportJob.ErrorStage
  | AlexaPublishJob.ErrorStage
  | GeneralJob.ErrorStage;

export type AnyPublishJobErrorType = GooglePublishJobErrorType | DialogflowPublishJobErrorType | AlexaPublishJobErrorType;

export type AnyStageType = AlexaStageType | GoogleStageType | DialogflowStageType;

export * from './alexa';
export * from './dialogflow';
export * from './general';
export * from './google';

export const getPlatformName = createPlatformSelector(
  {
    [GeneralConstants.PlatformType.ALEXA]: 'Alexa',
    [GeneralConstants.PlatformType.GOOGLE]: 'Google',
    [GeneralConstants.PlatformType.DIALOGFLOW_ES_CHAT]: 'Dialogflow',
    [GeneralConstants.PlatformType.DIALOGFLOW_ES_VOICE]: 'Dialogflow',
  },
  ''
);

export const getDefaultPlatformLanguageLabel = createPlatformSelector(
  {
    [GeneralConstants.PlatformType.ALEXA]: LOCALE_MAP[0].name,
    [GeneralConstants.PlatformType.GOOGLE]: FORMATTED_GOOGLE_LOCALES_LABELS[GoogleConstants.Language.EN],
    [GeneralConstants.PlatformType.DIALOGFLOW_ES_CHAT]: FORMATTED_DIALOGFLOW_LOCALES_LABELS[DialogflowConstants.Language.EN],
    [GeneralConstants.PlatformType.DIALOGFLOW_ES_VOICE]: FORMATTED_DIALOGFLOW_LOCALES_LABELS[DialogflowConstants.Language.EN],
  },
  GENERAL_LOCALE_NAME_MAP[GeneralConstants.Locale.EN_US]
);
