import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useContextApi, useDidUpdateEffect, useSetup, useTeardown, withContext } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import { JobStatus } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { AlexaPublishJob, DialogflowPublishJob, GooglePublishJob } from '@/models';

export type AnyJob = AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob | DialogflowPublishJob.AnyJob;
export interface PublishContextValue<T extends AnyJob> {
  job: Nullable<T>;
  setJob: (job: Nullable<AnyJob>) => void;
  cancel: () => Promise<void>;
  retry: (reset?: () => Promise<void>) => Promise<void>;
  publish: (options?: { versionName?: string; submit?: boolean }) => Promise<void>;
  updateCurrentStage: (data: unknown) => Promise<void>;
}

export const PublishContext = React.createContext<Nullable<PublishContextValue<AnyJob>>>(null);
export const { Consumer: PublishConsumer } = PublishContext;

const PULL_TIMEOUT = 3000; // 3s

export const PublishProvider: React.FC = ({ children }) => {
  const pullTimeout = React.useRef<NodeJS.Timeout>();
  const [job, setJob] = React.useState<Nullable<AnyJob>>(null);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const platformClient = React.useMemo(() => {
    const isDialogflowPlatform = Realtime.Utils.typeGuards.isDialogflowPlatform(platform);

    if (isDialogflowPlatform) {
      return { ...client.platform.google, publish: client.platform.dialogflow.publish };
    }

    return client.platform(platform);
  }, [platform]);

  const getJob = React.useCallback(async () => {
    const currentJob = await platformClient.publish.getStatus(projectID);

    setJob(currentJob || null);
  }, [projectID, platformClient]);

  const publish = React.useCallback(
    async (options: { versionName?: string; submit?: boolean } = {}) => {
      const result = await platformClient.publish.run(projectID, options);

      setJob(result?.job || null);
    },
    [projectID, platformClient]
  );

  const updateCurrentStage = React.useCallback(
    async (data: unknown) => {
      if (!job) return;

      await platformClient.publish.updateStage(projectID, job.stage.type as never, data);
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

    setJob(null);

    await platformClient?.publish.cancel(projectID);
  }, [projectID, platformClient]);

  const retry = React.useCallback(
    async (reset?: () => Promise<void>) => {
      await cancel();
      await reset?.();
      await publish();
    },
    [publish, cancel]
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

  const api = useContextApi({ job, cancel, publish, retry, updateCurrentStage, setJob });

  return <PublishContext.Provider value={api}>{children}</PublishContext.Provider>;
};

export const withPublish = withContext(PublishContext, 'publish');
