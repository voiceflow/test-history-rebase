import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { JobStatus } from '@/constants';
import { GoogleStageType } from '@/constants/platforms';
import { PublishContext, PublishContextValue } from '@/contexts/PublishContext';
import * as Account from '@/ducks/account';
import { useDispatch, useSetup, useStore } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { GooglePublishJob } from '@/models';

export const useGooglePublishContext = () => {
  const store = useStore();
  const loadGoogleAccount = useDispatch(Account.google.loadAccount);

  const publishContext = React.useContext(PublishContext)! as PublishContextValue<GooglePublishJob.AnyJob>;

  const publishNewVersionModal = ModalsV2.useModal(ModalsV2.Publish.NewVersion);

  const onPublish = usePersistFunction(async () => {
    try {
      const { versionName } = await publishNewVersionModal.open({});

      // ensure we get the current state of the store
      const state = store.getState();
      const hasGoogleAccount = !!Account.googleAccountSelector(state);
      const startingOptions = { versionName };

      if (!hasGoogleAccount) {
        // set a "fake" job and get the user to login before continuing
        publishContext.setJob({ id: 'login', stage: { type: GoogleStageType.WAIT_ACCOUNT, data: {} }, status: JobStatus.FINISHED }, startingOptions);
        return;
      }

      publishContext.start(startingOptions);
    } catch {
      // cancelled
    }
  });

  useSetup(loadGoogleAccount);

  return { ...publishContext, onPublish };
};
