import { Nullable } from '@voiceflow/common';

import { JobStatus } from '@/constants';
import { Job } from '@/models';

export const isRunning = (job: Nullable<Job<any>>): boolean =>
  job?.status === JobStatus.ACTIVE || job?.status === JobStatus.PENDING || job?.status === JobStatus.IDLE;

export const getProgress = (job: Nullable<Job<any>>): number => {
  const progress = job?.stage?.data?.progress;
  return typeof progress === 'number' ? progress : 0;
};
