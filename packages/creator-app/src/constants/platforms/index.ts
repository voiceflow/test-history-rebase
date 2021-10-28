import { Constants } from '@voiceflow/general-types';

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
import { createPlatformSelector } from '@/utils/platform';

import { AlexaPublishJobErrorType, AlexaStageType } from './alexa';
import { DialogflowPublishJobErrorType, DialogflowStageType } from './dialogflow';
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
    [Constants.PlatformType.ALEXA]: 'Alexa',
    [Constants.PlatformType.GOOGLE]: 'Google',
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: 'Dialogflow',
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: 'Dialogflow',
  },
  ''
);
