import { JobStatus } from '@/constants';
import { AlexaJobErrorType, AlexaJobSuccessType, AlexaStageType, PrototypeStageType } from '@/constants/platforms';

export type JobStage<T extends string = string, D extends object = object> = {
  type: T;
  data: D;
};

export type Job<S extends JobStage = JobStage> = {
  id: string;
  stage: S;
  status: JobStatus;
};

export namespace AlexaJob {
  export type IdleStage = JobStage<AlexaStageType.IDLE, Record<string, unknown>>;

  export type ErrorStage = JobStage<
    AlexaStageType.ERROR,
    {
      message: string;
      errorType: AlexaJobErrorType;
      error?: string;
    }
  >;

  export type SuccessStage = JobStage<
    AlexaStageType.SUCCESS,
    {
      message: string;
      amazonID: string;
      versionID: string;
      successType: AlexaJobSuccessType;
      rootDiagramID: string;
      succeededLocale: string | null;
      submittedForReview?: boolean;
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
