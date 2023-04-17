import { Nullable } from '@voiceflow/common';
import { useContextApi, useDidUpdateEffect, usePersistFunction, useSetup, useTeardown } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { JobStatus } from '@/constants';
import * as Session from '@/ducks/session';
import { Job, JobClient } from '@/models';
import { getProgress, isRunning } from '@/utils/job';

export interface JobContextValue<T extends Job<any>> {
  job: Nullable<T>;
  active: boolean;
  setJob: (job: Nullable<Job<any>>, options?: Record<string, unknown>) => void;
  cancel: () => Promise<void>;
  retry: (reset?: () => Promise<void>) => Promise<void>;
  start: (options?: Record<string, unknown>) => Promise<void>;
  restart: () => Promise<void>;
  updateCurrentStage: (data: unknown) => Promise<void>;
}

const PULL_TIMEOUT = 3000; // 3s

export const useJob = <J extends Job<any>, S extends string = string>(jobClient?: JobClient<J, S>) => {
  const pullTimeout = React.useRef<NodeJS.Timeout>();
  const startingOptionsCache = React.useRef<Record<string, unknown>>({});
  const [job, setJob] = React.useState<Nullable<J>>(null);
  const [starting, setStarting] = React.useState(false);

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const getJob = React.useCallback(async () => {
    const currentJob = await jobClient?.getStatus(projectID);

    setJob(currentJob || null);
  }, [projectID, jobClient]);

  const start = usePersistFunction(async (options: Record<string, unknown> = {}) => {
    try {
      setStarting(true);
      const result = await jobClient?.run(projectID, options);
      startingOptionsCache.current = options;

      setJob(result?.job || null);
    } finally {
      setStarting(false);
    }
  });

  const restart = React.useCallback(async () => {
    start(startingOptionsCache.current);
  }, [start]);

  const updateCurrentStage = React.useCallback(
    async (data: unknown) => {
      if (!job) return;

      await jobClient?.updateStage(projectID, job.stage.type as never, data);
      await getJob(); // to fetch updated status
    },
    [projectID, jobClient, job?.stage.type]
  );

  const stopPulling = React.useCallback(() => {
    if (pullTimeout.current) {
      clearTimeout(pullTimeout.current);
    }

    pullTimeout.current = undefined;
  }, []);

  const cancel = React.useCallback(async () => {
    stopPulling();

    setJob(null);

    await jobClient?.cancel(projectID);
  }, [projectID, jobClient]);

  const retry = React.useCallback(
    async (reset?: () => Promise<void>) => {
      await cancel();
      await reset?.();
      await start();
    },
    [start, cancel]
  );

  useSetup(getJob);

  useDidUpdateEffect(() => {
    // stop pulling when projectID/platform changed
    stopPulling();

    getJob();
  }, [projectID, getJob]);

  useDidUpdateEffect(() => {
    // stop pulling when job is finished or job was canceled
    if (!job || job.status === JobStatus.FINISHED) {
      stopPulling();

      jobClient?.cancel(projectID);

      return;
    }

    // start pulling if there's no active pulls
    if (pullTimeout.current === undefined) {
      const pull = () => {
        getJob();

        pullTimeout.current = setTimeout(pull, PULL_TIMEOUT);
      };

      pull();
    }
  }, [job?.status, getJob]);

  useTeardown(stopPulling);

  const setJobWithStartingOptions = React.useCallback((job: Nullable<J>, options?: Record<string, unknown>) => {
    if (options) {
      startingOptionsCache.current = options;
    }
    setJob(job);
  }, []);

  const active = starting || isRunning(job);

  return useContextApi({ job, active, cancel, start, restart, retry, updateCurrentStage, setJob: setJobWithStartingOptions });
};

// simulate fake progress between checkpoints
const SIMULATED_PROGRESS_RANGE = 20;
export const useSimulatedProgress = (job: Nullable<Job<any>>) => {
  const progress = getProgress(job);
  const active = isRunning(job);
  const [simulatedProgress, setSimulatedProgress] = React.useState(progress);
  const timeout = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (!active) {
      clearTimeout(Number(timeout.current));
      setSimulatedProgress(0);
      return;
    }

    if (simulatedProgress > progress) {
      return;
    }

    clearTimeout(Number(timeout.current));
    setSimulatedProgress(progress);

    (function incrementProgress(interval = 500, depth = 0) {
      if (depth >= SIMULATED_PROGRESS_RANGE) return;

      setSimulatedProgress((prev) => Math.min(prev + 1, 99));
      // exponential backoff
      timeout.current = setTimeout(() => incrementProgress(interval * 1.2, depth + 1), interval);
    })();
  }, [progress, active]);

  return simulatedProgress;
};

export default useJob;
