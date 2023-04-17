import { Nullable, Utils } from '@voiceflow/common';

import { JobBuiltinStageType, JobStatus } from '@/constants';
import { Job } from '@/models';

export interface AbortControl {
  aborted: boolean;
}

export const waitJobFinished = async <J extends Job>({
  fetchJob,
  maxChecks,
  abortControl,
}: {
  fetchJob: () => Promise<Nullable<J>>;
  maxChecks: number;
  abortControl: AbortControl;
}): Promise<void> => {
  const check = async (count = 0) => {
    if (count === maxChecks) throw new Error('Render Timed Out');
    if (abortControl.aborted) return;

    const job = await fetchJob();

    if (job === null || (job.status === JobStatus.FINISHED && job.stage.type === JobBuiltinStageType.ERROR)) {
      throw new Error('Job is canceled or finished with error');
    }

    if (job.status === JobStatus.FINISHED && job.stage.type === JobBuiltinStageType.SUCCESS) return;

    await Utils.promise.delay(2000);

    await check(count + 1);
  };

  return check();
};

export const isRunning = (job: Nullable<Job<any>>): boolean =>
  job?.status === JobStatus.ACTIVE || job?.status === JobStatus.PENDING || job?.status === JobStatus.IDLE;

export const isFinished = (job: Nullable<Job<any>>): boolean => job?.status === JobStatus.FINISHED;

export const isNotify = (job: Nullable<Job<any>>): boolean => job?.status === JobStatus.PENDING || isFinished(job);

export const isReady = (job: Nullable<Job<any>>): boolean => !job || isFinished(job);

export const getProgress = (job: Nullable<Job<any>>): number => {
  const progress = job?.stage?.data?.progress;
  return typeof progress === 'number' ? progress : 0;
};
