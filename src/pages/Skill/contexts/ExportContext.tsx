import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import { JobStatus } from '@/constants';
import * as Skill from '@/ducks/skill';
import { withContext } from '@/hocs/withContext';
import { useDidUpdateEffect, useTeardown } from '@/hooks';
import { AlexaExportJob, GoogleExportJob } from '@/models';
import { Nullable } from '@/types';

export type ExportContextValue = {
  job: Nullable<AlexaExportJob.AnyJob | GoogleExportJob.AnyJob>;
  start: () => Promise<void>;
  cancel: () => Promise<void>;
  updateCurrentStage: (data: unknown) => Promise<void>;
};

export const ExportContext = React.createContext<Nullable<ExportContextValue>>(null);
export const { Consumer: ExportConsumer } = ExportContext;

const PULL_TIMEOUT = 1500; // 1.5s

export const ExportProvider: React.FC = ({ children }) => {
  const pullTimeout = React.useRef<number>();
  const [job, setJob] = React.useState<Nullable<AlexaExportJob.AnyJob | GoogleExportJob.AnyJob>>(null);

  const platform = useSelector(Skill.activePlatformSelector);
  const projectID = useSelector(Skill.activeProjectIDSelector);

  const platformClient = client.platform(platform);

  const getJob = React.useCallback(async () => {
    const currentJob = await platformClient?.export.getStatus(projectID);

    setJob(currentJob || null);
  }, [projectID, platformClient]);

  const start = React.useCallback(async () => {
    const result = await platformClient?.export.run(projectID);

    setJob(result?.job || null);
  }, [projectID, platformClient]);

  const updateCurrentStage = React.useCallback(
    async (data: unknown) => {
      if (!job) {
        return;
      }

      await platformClient?.export.updateStage(projectID, job.stage.type as never, data);
      await getJob(); // to fetch updated status
    },
    [projectID, platformClient, job?.stage.type]
  );

  const stopPulling = React.useCallback(() => {
    clearTimeout(pullTimeout.current);

    pullTimeout.current = undefined;
  }, []);

  const cancel = React.useCallback(async () => {
    stopPulling();

    await platformClient?.export.cancel(projectID);

    setJob(null);
  }, [projectID, platformClient]);

  useDidUpdateEffect(() => {
    // stop pulling when job is finished or job was canceled
    if (job === null || job.status === JobStatus.FINISHED) {
      stopPulling();

      platformClient?.export.cancel(projectID);

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

  useTeardown(() => {
    cancel();
    stopPulling();
  });

  return <ExportContext.Provider value={{ job, cancel, start, updateCurrentStage }}>{children}</ExportContext.Provider>;
};

export const withExport = withContext(ExportContext, 'export');
