import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import client from '@/client';
import { JobStatus } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Skill from '@/ducks/skill';
import { withContext } from '@/hocs/withContext';
import { useDidUpdateEffect, useSetup, useTeardown } from '@/hooks';
import { AlexaPublishJob, GooglePublishJob } from '@/models';
import { Nullable } from '@/types';

export type PublishContextValue = {
  job: Nullable<AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob>;
  cancel: () => Promise<void>;
  publish: () => Promise<void>;
  updateCurrentStage: (data: unknown) => Promise<void>;
};

export const PublishContext = React.createContext<Nullable<PublishContextValue>>(null);
export const { Consumer: PublishConsumer } = PublishContext;

const PULL_TIMEOUT = 3000; // 3s

export const PublishProvider: React.FC = ({ children }) => {
  const pullTimeout = React.useRef<NodeJS.Timeout>();
  const [job, setJob] = React.useState<Nullable<AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob>>(null);

  const platform = useSelector(Skill.activePlatformSelector);
  const projectID = useSelector(Skill.activeProjectIDSelector);
  const dispatch = useDispatch();

  const platformClient = client.platform(platform);

  const getJob = React.useCallback(async () => {
    const currentJob = await platformClient?.publish.getStatus(projectID);

    setJob(currentJob || null);
  }, [projectID, platformClient]);

  const publish = React.useCallback(
    async (submit = false) => {
      try {
        await dispatch(Diagram.saveActiveDiagram());
      } catch (error) {
        console.error(error);
      }

      const result = await platformClient?.publish.run(projectID, submit);

      setJob(result?.job || null);
    },
    [projectID, platformClient]
  );

  const updateCurrentStage = React.useCallback(
    async (data: unknown) => {
      if (!job) return;

      await platformClient?.publish.updateStage(projectID, job.stage.type as never, data);
      await getJob(); // to fetch updated status
    },
    [projectID, platformClient, job?.stage.type]
  );

  const stopPulling = React.useCallback(() => {
    if (pullTimeout.current) {
      clearTimeout(pullTimeout.current);
    }

    pullTimeout.current = undefined;
  }, []);

  const cancel = React.useCallback(async () => {
    stopPulling();

    await platformClient?.publish.cancel(projectID);

    setJob(null);
  }, [projectID, platformClient]);

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

      platformClient?.publish.cancel(projectID);

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
    stopPulling();
  });

  return <PublishContext.Provider value={{ job, cancel, publish, updateCurrentStage }}>{children}</PublishContext.Provider>;
};

export const withPublish = withContext(PublishContext, 'publish');
