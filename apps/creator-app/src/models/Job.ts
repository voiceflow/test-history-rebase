import type { JobStatus } from '@/constants';
import type {
  AlexaPublishJobErrorType,
  AlexaStageType,
  DialogflowCXPublishJobErrorType,
  DialogflowCXStageType,
  DialogflowESPublishJobErrorType,
  DialogflowESStageType,
  GeneralJobErrorType,
  GeneralStageType,
  GooglePublishJobErrorType,
  GoogleStageType,
  NLPTrainJobErrorType,
  NLPTrainStageType,
  SMSPublishStageType,
  TwilioPrototypeStageType,
} from '@/constants/platforms';

export interface JobStage<T extends string = string, D extends object = object> {
  type: T;
  data: D;
}

export interface Job<S extends JobStage = JobStage> {
  id: string;
  stage: S;
  status: JobStatus;
}

export interface JobClient<J extends Job<any>, S extends string = string> {
  run: (projectID: string, options: Record<string, unknown>) => Promise<{ job: J; projectID: string }>;

  cancel: (projectID: string) => Promise<void>;

  getStatus: (projectID: string) => Promise<J | null>;

  updateStage: (projectID: string, stage: S, data: unknown) => Promise<void>;
}

export type JobStageData<S extends JobStage> = S extends JobStage<string, infer D> ? D : never;

export namespace AlexaPublishJob {
  export type IdleStage = JobStage<AlexaStageType.IDLE, Record<string, unknown>>;

  export type ErrorStage = JobStage<
    AlexaStageType.ERROR,
    {
      message: string;
      errorType: AlexaPublishJobErrorType;
      error?: any;
      amazonError?: boolean;
      progress?: number;
    }
  >;

  export type SuccessStage = JobStage<
    AlexaStageType.SUCCESS,
    {
      message: string;
      amazonID: string;
      versionID: string;
      rootDiagramID: string;
      succeededLocale: string | null;
      submittedForReview?: boolean;
      selectedVendorID: string | null;
    }
  >;

  export type ProgressStage = JobStage<
    AlexaStageType.PROGRESS,
    {
      message: string;
      progress: number;
    }
  >;

  export type WaitAccountStage = JobStage<AlexaStageType.WAIT_ACCOUNT>;

  export type WaitVendorsStage = JobStage<AlexaStageType.WAIT_VENDORS>;

  export type SelectVendorsStage = JobStage<AlexaStageType.SELECT_VENDORS>;

  export type AnyJob = Job<
    IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitVendorsStage | SelectVendorsStage
  >;
}

export namespace AlexaExportJob {
  export type IdleStage = AlexaPublishJob.IdleStage;

  export type ErrorStage = AlexaPublishJob.ErrorStage;

  export type SuccessStage = JobStage<
    AlexaStageType.SUCCESS,
    {
      data: string;
      fileName: string;
    }
  >;

  export type ProgressStage = AlexaPublishJob.ProgressStage;

  export type WaitAccountStage = AlexaPublishJob.WaitAccountStage;

  export type WaitVendorsStage = AlexaPublishJob.WaitVendorsStage;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitVendorsStage>;
}

export namespace DialogflowESPublishJob {
  export type IdleStage = JobStage<DialogflowESStageType.IDLE, Record<string, unknown>>;

  export type ErrorStage = JobStage<
    DialogflowESStageType.ERROR,
    {
      message: string;
      errorType: DialogflowESPublishJobErrorType;
      error?: any;
      googleError?: boolean;
      statusCode?: number;
    }
  >;

  export type SuccessStage = JobStage<
    DialogflowESStageType.SUCCESS,
    {
      message: string;
      googleProjectID: string;
      agentName: string;
      versionID: string;
      rootDiagramID: string;
      submittedForReview?: boolean;
    }
  >;

  export type ProgressStage = JobStage<
    DialogflowESStageType.PROGRESS,
    {
      message: string;
      progress: number;
    }
  >;

  export type WaitAccountStage = JobStage<DialogflowESStageType.WAIT_ACCOUNT>;

  export type WaitProjectStage = JobStage<DialogflowESStageType.WAIT_PROJECT>;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitProjectStage>;
}

export namespace DialogflowCXPublishJob {
  export type IdleStage = JobStage<DialogflowCXStageType.IDLE, Record<string, unknown>>;

  export type ErrorStage = JobStage<
    DialogflowCXStageType.ERROR,
    {
      message: string;
      errorType: DialogflowCXPublishJobErrorType;
      error?: any;
      googleError?: boolean;
      statusCode?: number;
    }
  >;

  export type SuccessStage = JobStage<
    DialogflowCXStageType.SUCCESS,
    {
      message: string;
      googleProjectID: string;
      agentName: string;
      versionID: string;
      rootDiagramID: string;
      submittedForReview?: boolean;
    }
  >;

  export type ProgressStage = JobStage<
    DialogflowCXStageType.PROGRESS,
    {
      message: string;
      progress: number;
    }
  >;

  export type WaitAccountStage = JobStage<DialogflowCXStageType.WAIT_ACCOUNT>;

  export type WaitAgentStage = JobStage<DialogflowCXStageType.WAIT_AGENT>;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitAgentStage>;
}

export namespace GooglePublishJob {
  export type IdleStage = JobStage<GoogleStageType.IDLE, Record<string, unknown>>;

  export type ErrorStage = JobStage<
    GoogleStageType.ERROR,
    {
      message: string;
      errorType: GooglePublishJobErrorType;
      error?: any;
      googleError?: boolean;
      statusCode?: number;
    }
  >;

  export type SuccessStage = JobStage<
    GoogleStageType.SUCCESS,
    {
      message: string;
      googleProjectID: string;
      agentName: string;
      versionID: string;
      rootDiagramID: string;
      submittedForReview?: boolean;
    }
  >;

  export type ProgressStage = JobStage<
    GoogleStageType.PROGRESS,
    {
      message: string;
      progress: number;
    }
  >;

  export type WaitAccountStage = JobStage<GoogleStageType.WAIT_ACCOUNT>;

  export type WaitProjectStage = JobStage<GoogleStageType.WAIT_PROJECT>;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitProjectStage>;
}

export namespace GoogleExportJob {
  export type IdleStage = GooglePublishJob.IdleStage;

  export type ErrorStage = GooglePublishJob.ErrorStage;

  export type SuccessStage = JobStage<
    GoogleStageType.SUCCESS,
    {
      data: string;
      fileName: string;
    }
  >;

  export type ProgressStage = GooglePublishJob.ProgressStage;

  export type WaitAccountStage = GooglePublishJob.WaitAccountStage;

  export type WaitProjectStage = JobStage<GoogleStageType.WAIT_PROJECT>;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitProjectStage>;
}

export namespace GeneralExportJob {
  export type IdleStage = JobStage<GeneralStageType.IDLE, Record<string, unknown>>;

  export type ErrorStage = JobStage<
    GeneralStageType.ERROR,
    {
      message: string;
      errorType: GeneralJobErrorType;
      error?: any;
    }
  >;

  export type SuccessStage = JobStage<
    GeneralStageType.SUCCESS,
    {
      data: string;
      fileName: string;
    }
  >;

  export type ProgressStage = JobStage<
    GeneralStageType.PROGRESS,
    {
      message: string;
      progress: number;
    }
  >;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage>;
}

export namespace NLPTrainJob {
  export type IdleStage = JobStage<NLPTrainStageType.IDLE, Record<string, unknown>>;

  export type ErrorStage = JobStage<
    NLPTrainStageType.ERROR,
    {
      error?: any;
      message: string;
      errorType: NLPTrainJobErrorType;
      progress?: number;
    }
  >;

  export type ConfirmStage = JobStage<NLPTrainStageType.CONFIRM>;

  export type SuccessStage = JobStage<
    NLPTrainStageType.SUCCESS,
    { validations?: { invalid: { intents: string[]; slots: string[] } } }
  >;

  export type ProgressStage = JobStage<NLPTrainStageType.PROGRESS, { message: string; progress: number }>;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage>;
}

export namespace TwilioPrototypeJob {
  export type IdleStage = JobStage<TwilioPrototypeStageType.IDLE>;

  export type ErrorStage = JobStage<
    TwilioPrototypeStageType.ERROR,
    {
      error?: any;
      message: string;
      errorType: NLPTrainJobErrorType;
      progress?: number;
    }
  >;

  export type MessagingStage = JobStage<TwilioPrototypeStageType.MESSAGING, { phoneNumber: string }>;

  export type WaitNumberStage = JobStage<TwilioPrototypeStageType.WAIT_NUMBER>;

  export type AnyJob = Job<IdleStage | ErrorStage | MessagingStage | WaitNumberStage>;
}

export namespace SMSPublishJob {
  export type IdleStage = JobStage<SMSPublishStageType.IDLE>;

  export type ErrorStage = JobStage<
    SMSPublishStageType.ERROR,
    {
      error?: any;
      message: string;
      errorType: NLPTrainJobErrorType;
      progress?: number;
    }
  >;

  export type SuccessStage = JobStage<NLPTrainStageType.SUCCESS>;

  export type CheckAPISecretsStage = JobStage<SMSPublishStageType.CHECK_API_SECRETS>;

  export type CheckServiceStage = JobStage<SMSPublishStageType.CHECK_SERVICE>;

  export type ValidateNumbersStage = JobStage<SMSPublishStageType.VALIDATE_NUMBERS>;

  export type IntegrationInvalidCredentialsStage = JobStage<SMSPublishStageType.INTEGRATION_INVALID_CREDENTIALS>;

  export type IntegrationResourceNotFoundStage = JobStage<SMSPublishStageType.INTEGRATION_RESOURCE_NOT_FOUND>;

  export type AnyJob = Job<
    | IdleStage
    | ErrorStage
    | SuccessStage
    | CheckAPISecretsStage
    | CheckServiceStage
    | ValidateNumbersStage
    | IntegrationInvalidCredentialsStage
    | IntegrationResourceNotFoundStage
  >;
}
