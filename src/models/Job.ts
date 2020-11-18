import { JobStatus } from '@/constants';
import {
  AlexaExportJobSuccessType,
  AlexaPublishJobErrorType,
  AlexaPublishJobSuccessType,
  AlexaStageType,
  GoogleExportJobSuccessType,
  GooglePublishJobErrorType,
  GooglePublishJobSuccessType,
  GoogleStageType,
  PrototypeStageType,
} from '@/constants/platforms';

export type JobStage<T extends string = string, D extends object = object> = {
  type: T;
  data: D;
};

export type Job<S extends JobStage = JobStage> = {
  id: string;
  stage: S;
  status: JobStatus;
};

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

  export type WaitInvocationNameStage = JobStage<AlexaStageType.WAIT_INVOCATION_NAME, { error: string }>;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage | WaitAccountStage | WaitVendorsStage | WaitInvocationNameStage>;
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

export namespace GooglePublishJob {
  export type IdleStage = JobStage<GoogleStageType.IDLE, Record<string, unknown>>;

  export type ErrorStage = JobStage<
    GoogleStageType.ERROR,
    {
      message: string;
      errorType: GooglePublishJobErrorType;
      error?: any;
      googleError?: boolean;
    }
  >;

  export type SuccessStage = JobStage<
    GoogleStageType.SUCCESS,
    {
      message: string;
      googleProjectID: string;
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

export namespace PrototypeJob {
  export type IdleStage = JobStage<PrototypeStageType.IDLE, Record<string, unknown>>;

  export type ErrorStage = JobStage<
    PrototypeStageType.ERROR,
    {
      message: string;
      errorType: ProgressStage;
      error?: string;
    }
  >;

  export type SuccessStage = JobStage<PrototypeStageType.SUCCESS, Record<string, unknown>>;

  export type ProgressStage = JobStage<
    PrototypeStageType.PROGRESS,
    {
      message: string;
      progress: number;
    }
  >;

  export type AnyJob = Job<IdleStage | ErrorStage | SuccessStage | ProgressStage>;
}
