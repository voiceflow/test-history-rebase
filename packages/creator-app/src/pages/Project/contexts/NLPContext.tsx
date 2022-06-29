import { Nullable } from '@voiceflow/common';
import { toast, useContextApi, useDidUpdateEffect, useSetup, useTeardown, withContext } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import * as Errors from '@/config/errors';
import { JobStatus } from '@/constants';
import { VersionTag } from '@/constants/platforms';
import * as Session from '@/ducks/session';
import { NLPTrainJob } from '@/models';
import * as Sentry from '@/vendors/sentry';

export interface NLPContextValue {
  job: Nullable<NLPTrainJob.AnyJob>;
  cancel: () => Promise<void>;
  publish: (options?: { versionName?: string }) => Promise<void>;
  publishing: boolean;
}

export interface NLPProviderProps {
  tag?: VersionTag;
  onFinished?: () => any;
}

export const NLPContext = React.createContext<Nullable<NLPContextValue>>(null);
export const { Consumer: NLPConsumer } = NLPContext;

const PULL_TIMEOUT = 3000; // 3s

export const NLPProvider: React.FC<NLPProviderProps> = ({ tag = VersionTag.DEVELOPMENT, onFinished, children }) => {
  const pullTimeout = React.useRef<NodeJS.Timeout>();
  const [job, setJob] = React.useState<Nullable<NLPTrainJob.AnyJob>>(null);
  const [publishing, setPublishing] = React.useState<boolean>(false);

  const projectID = useSelector(Session.activeProjectIDSelector);

  const getJob = React.useCallback(async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    const currentJob = await client.platform.general.nlp.status(projectID, { tag });

    setJob(currentJob || null);
  }, [projectID]);

  const publish = React.useCallback(
    async (options?: { versionName?: string }) => {
      if (!projectID) {
        Sentry.error(Errors.noActiveProjectID());
        toast.genericError();
        return;
      }

      setPublishing(true);

      try {
        const result = await client.platform.general.nlp.publish(projectID, {
          tag,
          versionName: options?.versionName,
        });

        setJob(result?.job || null);
        setPublishing(false);
      } catch (err) {
        setPublishing(false);

        throw err;
      }
    },
    [projectID]
  );

  const stopPulling = React.useCallback(() => {
    if (pullTimeout.current) {
      clearTimeout(pullTimeout.current);
    }

    pullTimeout.current = undefined;
  }, []);

  const cancel = React.useCallback(async () => {
    stopPulling();

    await client.platform.general.nlp.cancel(projectID!, { tag });

    setJob(null);
  }, [projectID]);

  useSetup(getJob);

  useDidUpdateEffect(() => {
    // stop pulling when projectID/platform changed
    stopPulling();

    getJob();
  }, [projectID, getJob]);

  useDidUpdateEffect(() => {
    if (job && job.status === JobStatus.FINISHED) {
      onFinished?.();
    }

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

  const api = useContextApi({ job, cancel, publish, publishing, onFinished });

  return <NLPContext.Provider value={api}>{children}</NLPContext.Provider>;
};

export const withNLP = withContext(NLPContext, 'nlp');
