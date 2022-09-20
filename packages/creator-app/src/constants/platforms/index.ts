import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { AlexaExportJob, AlexaPublishJob, DialogflowPublishJob, GeneralExportJob, GoogleExportJob, GooglePublishJob, JobStageData } from '@/models';
import { FORMATTED_DIALOGFLOW_LOCALES_LABELS } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS } from '@/pages/Publish/Google/utils';
import LOCALE_MAP from '@/services/LocaleMap';

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
  | JobStageData<AlexaExportJob.ErrorStage>
  | JobStageData<AlexaPublishJob.ErrorStage>
  | JobStageData<GeneralExportJob.ErrorStage>;

export type AnyErrorStage =
  | GoogleExportJob.ErrorStage
  | GooglePublishJob.ErrorStage
  | DialogflowPublishJob.ErrorStage
  | AlexaExportJob.ErrorStage
  | AlexaPublishJob.ErrorStage
  | GeneralExportJob.ErrorStage;

export type AnyPublishJobErrorType = GooglePublishJobErrorType | DialogflowPublishJobErrorType | AlexaPublishJobErrorType;

export type AnyStageType = AlexaStageType | GoogleStageType | DialogflowStageType;

export * from './alexa';
export * from './dialogflow';
export * from './general';
export * from './google';

export const getPlatformName = Utils.platform.createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Alexa',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'Dialogflow',
    [VoiceflowConstants.PlatformType.RASA]: 'Rasa',
  },
  ''
);

export const getDefaultPlatformLanguageLabel = Utils.platform.createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: LOCALE_MAP[0].name,
    [VoiceflowConstants.PlatformType.GOOGLE]: FORMATTED_GOOGLE_LOCALES_LABELS[GoogleConstants.Language.EN],
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: FORMATTED_DIALOGFLOW_LOCALES_LABELS[DFESConstants.Language.EN],
  },
  GENERAL_LOCALE_NAME_MAP[VoiceflowConstants.Locale.EN_US]
);

export enum VersionTag {
  PRODUCTION = 'production', // version is published to production
  DEVELOPMENT = 'development', // version is still in development
}
