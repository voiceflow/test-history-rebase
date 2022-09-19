import { JobStatus } from '@/constants';
import {
  AlexaExportJobSuccessType,
  AlexaPublishJobErrorType,
  AlexaPublishJobSuccessType,
  AlexaStageType,
  DialogflowExportJobSuccessType,
  DialogflowPublishJobErrorType,
  DialogflowPublishJobSuccessType,
  DialogflowStageType,
  GeneralJobErrorType,
  GeneralJobSuccessType,
  GeneralStageType,
  GoogleExportJobSuccessType,
  GooglePublishJobErrorType,
  GooglePublishJobSuccessType,
  GoogleStageType,
  NLPTrainJobErrorType,
  NLPTrainJobSuccessType,
  NLPTrainStageType,
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
      successType: AlexaPublishJobSuccessType;
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

  export type WaitInvocationNameStage = JobStage<AlexaStageType.WAIT_INVOCATION_NAME, { error: string }>;

  export type AnyJob = Job<
    IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitVendorsStage | WaitInvocationNameStage | SelectVendorsStage
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
      successType: AlexaExportJobSuccessType;
    }
  >;

  export type ProgressStage = AlexaPublishJob.ProgressStage;

  export type WaitAccountStage = AlexaPublishJob.WaitAccountStage;

  export type WaitVendorsStage = AlexaPublishJob.WaitVendorsStage;

  export type WaitInvocationNameStage = AlexaPublishJob.WaitInvocationNameStage;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitVendorsStage | WaitInvocationNameStage>;
}

export namespace DialogflowPublishJob {
  export type IdleStage = JobStage<DialogflowStageType.IDLE, Record<string, unknown>>;

  export type ErrorStage = JobStage<
    DialogflowStageType.ERROR,
    {
      message: string;
      errorType: DialogflowPublishJobErrorType;
      error?: any;
      googleError?: boolean;
      statusCode?: number;
    }
  >;

  export type SuccessStage = JobStage<
    DialogflowStageType.SUCCESS,
    {
      message: string;
      googleProjectID: string;
      agentName: string;
      versionID: string;
      successType: DialogflowPublishJobSuccessType;
      rootDiagramID: string;
      submittedForReview?: boolean;
    }
  >;

  export type ProgressStage = JobStage<
    DialogflowStageType.PROGRESS,
    {
      message: string;
      progress: number;
    }
  >;

  export type WaitAccountStage = JobStage<DialogflowStageType.WAIT_ACCOUNT>;

  export type WaitProjectStage = JobStage<DialogflowStageType.WAIT_PROJECT>;

  export type WaitInvocationNameStage = JobStage<DialogflowStageType.WAIT_INVOCATION_NAME, { error: string }>;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitProjectStage | WaitInvocationNameStage>;
}

export namespace DialogflowExportJob {
  export type IdleStage = DialogflowPublishJob.IdleStage;

  export type ErrorStage = DialogflowPublishJob.ErrorStage;

  export type SuccessStage = JobStage<
    DialogflowStageType.SUCCESS,
    {
      data: string;
      fileName: string;
      successType: DialogflowExportJobSuccessType;
    }
  >;

  export type ProgressStage = DialogflowPublishJob.ProgressStage;

  export type WaitAccountStage = DialogflowPublishJob.WaitAccountStage;

  export type WaitProjectStage = JobStage<DialogflowStageType.WAIT_PROJECT>;

  export type WaitInvocationNameStage = DialogflowPublishJob.WaitInvocationNameStage;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitProjectStage | WaitInvocationNameStage>;
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
      successType: GooglePublishJobSuccessType;
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

  export type WaitInvocationNameStage = JobStage<GoogleStageType.WAIT_INVOCATION_NAME, { error: string }>;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitProjectStage | WaitInvocationNameStage>;
}

export namespace GoogleExportJob {
  export type IdleStage = GooglePublishJob.IdleStage;

  export type ErrorStage = GooglePublishJob.ErrorStage;

  export type SuccessStage = JobStage<
    GoogleStageType.SUCCESS,
    {
      data: string;
      fileName: string;
      successType: GoogleExportJobSuccessType;
    }
  >;

  export type ProgressStage = GooglePublishJob.ProgressStage;

  export type WaitAccountStage = GooglePublishJob.WaitAccountStage;

  export type WaitProjectStage = JobStage<GoogleStageType.WAIT_PROJECT>;

  export type WaitInvocationNameStage = GooglePublishJob.WaitInvocationNameStage;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitProjectStage | WaitInvocationNameStage>;
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
      successType: GeneralJobSuccessType;
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

  export type SuccessStage = JobStage<NLPTrainStageType.SUCCESS, { successType: NLPTrainJobSuccessType }>;

  export type ProgressStage = JobStage<NLPTrainStageType.PROGRESS, { message: string; progress: number }>;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage>;
}
