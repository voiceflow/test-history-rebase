import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { JobStatus } from '@/constants';
import { DialogflowCXStageType } from '@/constants/platforms';
import { PublishContext, PublishContextValue } from '@/contexts/PublishContext';
import * as Account from '@/ducks/account';
import * as Project from '@/ducks/projectV2';
import { useDispatch, useSelector, useSetup } from '@/hooks';
import { DialogflowCXPublishJob } from '@/models';

export const useDialogflowCXPublishContext = () => {
  const loadGoogleAccount = useDispatch(Account.google.loadAccount);
  const hasGoogleAccount = !!useSelector(Account.googleAccountSelector);
  const hasAgent = !!useSelector(Project.active.platformDataSelector)?.agent;

  const publishContext = React.useContext(PublishContext)! as PublishContextValue<DialogflowCXPublishJob.AnyJob>;

  const onPublish = usePersistFunction(() => {
    // set a "fake" job and get the user to login or enter version name before continuing
    if (!hasGoogleAccount) {
      publishContext.setJob({ id: 'login', stage: { type: DialogflowCXStageType.WAIT_ACCOUNT, data: {} }, status: JobStatus.FINISHED });
      return;
    }

    if (!hasAgent) {
      publishContext.setJob({ id: 'waitAgent', stage: { type: DialogflowCXStageType.WAIT_AGENT, data: {} }, status: JobStatus.FINISHED });
      return;
    }

    publishContext.setJob({ id: 'version', stage: { type: DialogflowCXStageType.WAIT_VERSION_NAME, data: {} }, status: JobStatus.FINISHED });
  });

  useSetup(loadGoogleAccount);

  const { job } = publishContext;
  // the job happens too fast, so on idle (start) set progress to 30 so users can see progress bar
  if (job?.status === JobStatus.IDLE) {
    job.stage.data = { ...job.stage.data, progress: 30 };
  }

  return { ...publishContext, onPublish, job };
};
