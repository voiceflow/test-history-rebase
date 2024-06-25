import type { ArrayItem } from '@voiceflow/realtime-sdk';

import type {
  AlexaExportJob,
  AlexaPublishJob,
  DialogflowCXPublishJob,
  DialogflowESPublishJob,
  GeneralExportJob,
  GoogleExportJob,
  GooglePublishJob,
  JobStageData,
  NLPTrainJob,
  SMSPublishJob,
  TwilioPrototypeJob,
} from '@/models';

import type { AlexaStageType } from './alexa';
import { AlexaPublishJobErrorType } from './alexa';
import type { DialogflowCXStageType } from './dialogflowCX';
import type { DialogflowESPublishJobErrorType, DialogflowESStageType } from './dialogflowES';
import type { GoogleStageType } from './google';
import { GooglePublishJobErrorType } from './google';

const AnyPublishJobRenderingError = [
  GooglePublishJobErrorType.RENDERING,
  AlexaPublishJobErrorType.RENDERING,
  GooglePublishJobErrorType.RENDERING,
];
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

export const IsPublishJobRenderingError = (type: string): type is ArrayItem<typeof AnyPublishJobRenderingError> =>
  AnyPublishJobRenderingError.includes(type as ArrayItem<typeof AnyPublishJobRenderingError>);

export const isPublishJobSubmittingReviewError = (
  type: string
): type is ArrayItem<typeof AnyPublishJobSubmittingReviewError> =>
  AnyPublishJobSubmittingReviewError.includes(type as ArrayItem<typeof AnyPublishJobSubmittingReviewError>);

export const isPublishJobSubmittingProjectError = (
  type: string
): type is ArrayItem<typeof AnyPublishJobSubmittingProjectError> =>
  AnyPublishJobSubmittingProjectError.includes(type as ArrayItem<typeof AnyPublishJobSubmittingProjectError>);

export type AnyErrorStageData =
  | JobStageData<GoogleExportJob.ErrorStage>
  | JobStageData<GooglePublishJob.ErrorStage>
  | JobStageData<DialogflowESPublishJob.ErrorStage>
  | JobStageData<DialogflowCXPublishJob.ErrorStage>
  | JobStageData<AlexaExportJob.ErrorStage>
  | JobStageData<AlexaPublishJob.ErrorStage>
  | JobStageData<GeneralExportJob.ErrorStage>
  | JobStageData<NLPTrainJob.ErrorStage>
  | JobStageData<TwilioPrototypeJob.ErrorStage>
  | JobStageData<SMSPublishJob.ErrorStage>;

export type AnyErrorStage =
  | GoogleExportJob.ErrorStage
  | GooglePublishJob.ErrorStage
  | DialogflowESPublishJob.ErrorStage
  | DialogflowCXPublishJob.ErrorStage
  | AlexaExportJob.ErrorStage
  | AlexaPublishJob.ErrorStage
  | GeneralExportJob.ErrorStage
  | NLPTrainJob.ErrorStage
  | TwilioPrototypeJob.ErrorStage
  | SMSPublishJob.ErrorStage;

export type AnyPublishJobErrorType =
  | GooglePublishJobErrorType
  | DialogflowESPublishJobErrorType
  | AlexaPublishJobErrorType
  | DialogflowCXStageType;

export type AnyStageType = AlexaStageType | GoogleStageType | DialogflowESStageType;

export * from './alexa';
export * from './dialogflowCX';
export * from './dialogflowES';
export * from './general';
export * from './google';
export * from './ms-teams';
export * from './sms';
export * from './webchat';
export * from './whatsapp';

export enum VersionTag {
  PRODUCTION = 'production', // version is published to production
  DEVELOPMENT = 'development', // version is still in development
}
