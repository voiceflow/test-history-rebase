import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import {
  AlexaExportJob,
  AlexaPublishJob,
  DialogflowCXPublishJob,
  DialogflowESPublishJob,
  GeneralExportJob,
  GoogleExportJob,
  GooglePublishJob,
  JobStageData,
  NLPTrainJob,
} from '@/models';
import { FORMATTED_DIALOGFLOW_LOCALES_LABELS } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS } from '@/pages/Publish/Google/utils';
import LOCALE_MAP from '@/services/LocaleMap';

import { AlexaPublishJobErrorType, AlexaStageType } from './alexa';
import { DialogflowCXStageType } from './dialogflowCX';
import { DialogflowESPublishJobErrorType, DialogflowESStageType } from './dialogflowES';
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
  | JobStageData<DialogflowESPublishJob.ErrorStage>
  | JobStageData<DialogflowCXPublishJob.ErrorStage>
  | JobStageData<AlexaExportJob.ErrorStage>
  | JobStageData<AlexaPublishJob.ErrorStage>
  | JobStageData<GeneralExportJob.ErrorStage>
  | JobStageData<NLPTrainJob.ErrorStage>;

export type AnyErrorStage =
  | GoogleExportJob.ErrorStage
  | GooglePublishJob.ErrorStage
  | DialogflowESPublishJob.ErrorStage
  | DialogflowCXPublishJob.ErrorStage
  | AlexaExportJob.ErrorStage
  | AlexaPublishJob.ErrorStage
  | GeneralExportJob.ErrorStage
  | NLPTrainJob.ErrorStage;

export type AnyPublishJobErrorType = GooglePublishJobErrorType | DialogflowESPublishJobErrorType | AlexaPublishJobErrorType | DialogflowCXStageType;

export type AnyStageType = AlexaStageType | GoogleStageType | DialogflowESStageType;

export * from './alexa';
export * from './dialogflowCX';
export * from './dialogflowES';
export * from './general';
export * from './google';
export * from './webchat';

export const getDefaultPlatformLanguageLabel = Utils.platform.createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: LOCALE_MAP[0].name,
    [Platform.Constants.PlatformType.GOOGLE]: FORMATTED_GOOGLE_LOCALES_LABELS[GoogleConstants.Language.EN],
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: FORMATTED_DIALOGFLOW_LOCALES_LABELS[DFESConstants.Language.EN],
  },
  GENERAL_LOCALE_NAME_MAP[VoiceflowConstants.Locale.EN_US]
);

export enum VersionTag {
  PRODUCTION = 'production', // version is published to production
  DEVELOPMENT = 'development', // version is still in development
}
