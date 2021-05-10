import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import { toast } from '@/components/Toast';
import * as Errors from '@/config/errors';
import { JobStatus } from '@/constants';
import * as Skill from '@/ducks/skill';
import { withContext } from '@/hocs/withContext';
import { useDidUpdateEffect, useSetup, useTeardown } from '@/hooks';
import { NLPTrainJob } from '@/models';
import { Nullable } from '@/types';
import * as Sentry from '@/vendors/sentry';

export type NLPContextValue = {
  job: Nullable<NLPTrainJob.AnyJob>;
  cancel: () => Promise<void>;
  publish: () => Promise<void>;
  publishing: boolean;
};

export const NLPContext = React.createContext<Nullable<NLPContextValue>>(null);
export const { Consumer: NLPConsumer } = NLPContext;

const PULL_TIMEOUT = 3000; // 3s

export const NLPProvider: React.FC = ({ children }) => {
  const pullTimeout = React.useRef<NodeJS.Timeout>();
  const [job, setJob] = React.useState<Nullable<NLPTrainJob.AnyJob>>(null);
  const [publishing, setPublishing] = React.useState<boolean>(false);

  const projectID = useSelector(Skill.activeProjectIDSelector);

  const getJob = React.useCallback(async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    const currentJob = await client.platform.general.nlp.status(projectID);

    setJob(currentJob || null);
  }, [projectID]);

  const publish = React.useCallback(async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    setPublishing(true);

    try {
      const result = await client.platform.general.nlp.publish(projectID);

      setJob(result?.job || null);
      setPublishing(false);
    } catch (err) {
      setPublishing(false);

      throw err;
    }
  }, [projectID]);

  const stopPulling = React.useCallback(() => {
    if (pullTimeout.current) {
      clearTimeout(pullTimeout.current);
    }

    pullTimeout.current = undefined;
  }, []);

  const cancel = React.useCallback(async () => {
    stopPulling();

    await client.platform.general.nlp.cancel(projectID);

    setJob(null);
  }, [projectID]);

  useSetup(getJob);

  useDidUpdateEffect(() => {
    // stop pulling when projectID/platform changed
    stopPulling();

    getJob();
  }, [projectID, getJob]);

  useDidUpdateEffect(() => {
    // stop pulling when job is finished or job was canceled
    if (!job || job.status === JobStatus.FINISHED) {
      cancel();
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

  return <NLPContext.Provider value={{ job, cancel, publish, publishing }}>{children}</NLPContext.Provider>;
};

export const withNLP = withContext(NLPContext, 'nlp');
