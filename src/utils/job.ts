import { JobBuiltinStageType, JobStatus } from '@/constants';
import { Job } from '@/models';
import { Nullable } from '@/types';
import { delay } from '@/utils/promise';

export type AbortControl = { aborted: boolean };

export const waitJobFinished = async <J extends Job>({
  fetchJob,
  maxChecks,
  abortControl,
}: {
  fetchJob: () => Promise<Nullable<J>>;
  maxChecks: number;
  abortControl: AbortControl;
}) => {
  const check = async (count = 0) => {
    if (count === maxChecks) throw new Error('Render Timed Out');
    if (abortControl.aborted) return;

    const job = await fetchJob();

    if (job === null || (job.status === JobStatus.FINISHED && job.stage.type === JobBuiltinStageType.ERROR)) {
      throw new Error('Job is canceled or finished with error');
    }

    if (job.status === JobStatus.FINISHED && job.stage.type === JobBuiltinStageType.SUCCESS) return;

    await delay(1000);

    await check(count + 1);
  };

  return check();
};
