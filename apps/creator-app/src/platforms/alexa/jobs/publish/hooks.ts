import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { JobStatus } from '@/constants';
import { AlexaStageType } from '@/constants/platforms';
import type { PublishContextValue } from '@/contexts/PublishContext';
import { PublishContext } from '@/contexts/PublishContext';
import * as Account from '@/ducks/account';
import { useDispatch, useSetup, useStore } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import type { AlexaPublishJob } from '@/models';

export const useAlexaPublishContext = ({ submit }: { submit?: boolean } = {}) => {
  const store = useStore();

  const loadAccount = useDispatch(Account.amazon.loadAccount);
  const resetSelectedVendor = useDispatch(Account.amazon.resetSelectedVendor);

  useSetup(() => loadAccount());

  const publishContext = React.useContext(PublishContext) as PublishContextValue<AlexaPublishJob.AnyJob>;

  const publishNewVersionModal = ModalsV2.useModal(ModalsV2.Publish.NewVersion);

  const onPublish = usePersistFunction(async () => {
    try {
      const { versionName } = await publishNewVersionModal.open({});

      // ensure we get the current state of the store
      const state = store.getState();
      const amazon = Account.amazonAccountSelector(state);
      const vendors = Account.amazonVendorsSelector(state);

      const startingOptions = { versionName, submit };

      // if we already know they have no vendors or not logged in, we can fake the current job for responsiveness
      if (vendors.length > 1) {
        // set a "fake" job and get the user to select a vendor before continuing
        publishContext.setJob(
          { id: 'vendors', stage: { type: AlexaStageType.SELECT_VENDORS, data: {} }, status: JobStatus.FINISHED },
          startingOptions
        );
        return;
      }

      if (!amazon) {
        // set a "fake" job and get the user to login before continuing
        publishContext.setJob(
          { id: 'login', stage: { type: AlexaStageType.WAIT_ACCOUNT, data: {} }, status: JobStatus.FINISHED },
          startingOptions
        );
        await resetSelectedVendor();
        return;
      }

      publishContext.start(startingOptions);
    } catch {
      // cancelled
    }
  });

  return {
    ...publishContext,
    onPublish,
  };
};
