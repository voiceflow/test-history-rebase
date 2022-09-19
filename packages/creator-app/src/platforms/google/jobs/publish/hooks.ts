import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { JobStatus, ModalType } from '@/constants';
import { GoogleStageType } from '@/constants/platforms';
import { PublishContext, PublishContextValue } from '@/contexts';
import * as Account from '@/ducks/account';
import { useDispatch, useModals, useSetup, useStore } from '@/hooks';
import { GooglePublishJob } from '@/models';

export const useGooglePublishContext = () => {
  const store = useStore();
  const loadGoogleAccount = useDispatch(Account.google.loadAccount);

  const publishContext = React.useContext(PublishContext)! as PublishContextValue<GooglePublishJob.AnyJob>;

  const publishNewVersionModal = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);

  // override the publish context's publish function
  const onConfirm = usePersistFunction(async (versionName: string) => {
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
  });

  const onPublish = usePersistFunction(() => {
    publishNewVersionModal.open({ onConfirm });
  });

  useSetup(loadGoogleAccount);

  return { ...publishContext, onPublish };
};
