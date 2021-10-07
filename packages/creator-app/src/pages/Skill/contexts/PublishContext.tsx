import { Constants } from '@voiceflow/general-types';
import { useContextApi, useDidUpdateEffect, useSetup, useTeardown, withContext } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import { FeatureFlag } from '@/config/features';
import { JobStatus } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useDispatch, useFeature } from '@/hooks';
import { AlexaPublishJob, DialogflowPublishJob, GooglePublishJob } from '@/models';
import { Nullable } from '@/types';
import * as Sentry from '@/vendors/sentry';

export interface PublishContextValue<T extends AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob | DialogflowPublishJob.AnyJob> {
  job: Nullable<T>;
  cancel: () => Promise<void>;
  publish: (submit?: boolean) => Promise<void>;
  updateCurrentStage: (data: unknown) => Promise<void>;
}

export const PublishContext =
  React.createContext<Nullable<PublishContextValue<AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob | DialogflowPublishJob.AnyJob>>>(null);
export const { Consumer: PublishConsumer } = PublishContext;

const PULL_TIMEOUT = 3000; // 3s

export const PublishProvider: React.FC = ({ children }) => {
  const pullTimeout = React.useRef<NodeJS.Timeout>();
  const [job, setJob] = React.useState<Nullable<AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob | DialogflowPublishJob.AnyJob>>(null);

  const isGoogleCreate = useFeature(FeatureFlag.GOOGLE_CREATE)?.isEnabled;
  const isDialogflow = useFeature(FeatureFlag.DIALOGFLOW)?.isEnabled;
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const saveActiveDiagram = useDispatch(Diagram.saveActiveDiagram);

  const platformClient = React.useMemo(
    () =>
      (platform === Constants.PlatformType.GOOGLE && isGoogleCreate && { ...client.platform.google, publish: client.platform.google.publishV2 }) ||
      (platform === Constants.PlatformType.DIALOGFLOW_ES &&
        isDialogflow && { ...client.platform.google, publish: client.platform.dialogflow.publish }) ||
      client.platform(platform),
    [platform]
  );

  const getJob = React.useCallback(async () => {
    const currentJob = await platformClient.publish.getStatus(projectID);

    setJob(currentJob || null);
  }, [projectID, platformClient]);

  const publish = React.useCallback(
    async (submit = false) => {
      try {
        await saveActiveDiagram();
      } catch (error) {
        Sentry.error(error);
      }

      const result = await platformClient.publish.run(projectID, submit);

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

  const api = useContextApi({ job, cancel, publish, updateCurrentStage });

  return <PublishContext.Provider value={api}>{children}</PublishContext.Provider>;
};

export const withPublish = withContext(PublishContext, 'publish');
