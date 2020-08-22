import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import client from '@/clientV2';
import { FeatureFlag } from '@/config/features';
import { JobStatus, PlatformType } from '@/constants';
import * as Diagram from '@/ducks/diagramV2';
import * as Skill from '@/ducks/skill';
import { withContext } from '@/hocs/withContext';
import { useDidUpdateEffect, useFeature, useSetup, useTeardown } from '@/hooks';
import { AlexaJob } from '@/models';
import { Nullable } from '@/types';
import { getPlatformValue } from '@/utils/platform';

export type PublishContextValue = {
  job: Nullable<AlexaJob.AnyJob>;
  cancel: () => Promise<void>;
  publish: () => Promise<void>;
  updateCurrentStage: (data: unknown) => Promise<void>;
};

export const PublishContext = React.createContext<Nullable<PublishContextValue>>(null);
export const { Consumer: PublishConsumer } = PublishContext;

const PULL_TIMEOUT = 3000; // 3s

export const PublishProvider: React.FC = ({ children }) => {
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);
  const pullTimeout = React.useRef<number>();
  const [job, setJob] = React.useState<Nullable<AlexaJob.AnyJob>>(null);

  const platform = useSelector(Skill.activePlatformSelector);
  const projectID = useSelector(Skill.activeProjectIDSelector);
  const dispatch = useDispatch();

  const service = getPlatformValue(platform, {
    [PlatformType.ALEXA]: client.alexaService,
  });

  const getJob = React.useCallback(async () => {
    const currentJob = await service?.getPublishStatus(projectID);

    setJob(currentJob || null);
  }, [projectID, service]);

  const publish = React.useCallback(async () => {
    await dispatch(Diagram.saveActiveDiagram());

    const result = await service?.publish(projectID);

    setJob(result?.job || null);
  }, [projectID, service]);

  const updateCurrentStage = React.useCallback(
    async (data: unknown) => {
      if (!job) {
        return;
      }

      await service?.updatePublishStage(projectID, job.stage.type, data);
      await getJob(); // to fetch updated status
    },
    [projectID, service, job?.stage.type]
  );

  const cancel = React.useCallback(async () => {
    await service?.cancelPublish(projectID);

    setJob(null);
  }, [projectID, service]);

  const stopPulling = React.useCallback(() => {
    clearTimeout(pullTimeout.current);

    pullTimeout.current = undefined;
  }, []);

  // eslint-disable-next-line lodash/prefer-constant
  useSetup(dataRefactor.isEnabled ? getJob : () => null);

  useDidUpdateEffect(() => {
    if (!dataRefactor.isEnabled) {
      return;
    }

    // stop pulling when projectID/platform changed
    stopPulling();

    getJob();
  }, [projectID, getJob]);

  useDidUpdateEffect(() => {
    if (!dataRefactor.isEnabled) {
      return;
    }

    // stop pulling when job is finished or job was canceled
    if (job === null || job.status === JobStatus.FINISHED) {
      stopPulling();
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
