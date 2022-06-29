import React from 'react';

import { JobStatus } from '@/constants';
import { AlexaStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { useDispatch, useSelector, useSetup } from '@/hooks';
import { AlexaPublishJob } from '@/models';

import { BasePublishApi, useBasePublish } from './basePublish';

export type AlexaPublishApi = BasePublishApi<AlexaPublishJob.AnyJob>;

export const useAlexaPublish = (): AlexaPublishApi => {
  const amazon = useSelector(Account.amazonAccountSelector);
  const vendors = useSelector(Account.amazonVendorsSelector);

  const needsLogin = !amazon;

  const loadAccount = useDispatch(Account.amazon.loadAccount);
  const resetSelectedVendor = useDispatch(Account.amazon.resetSelectedVendor);
  const onStateChanged = React.useCallback(() => {}, []);

  const basePublishApi = useBasePublish<typeof AlexaStageType, AlexaPublishJob.AnyJob>({
    StageType: AlexaStageType,
    needsLogin,
    onStateChanged,
  });

  const onPublish = React.useCallback(
    async (versionName: string) => {
      if (vendors.length > 1) {
        // set a "fake" job and get the user to select a vendor before continuing
        basePublishApi.setJob({ id: 'vendors', stage: { type: AlexaStageType.SELECT_VENDORS, data: {} }, status: JobStatus.FINISHED });
        basePublishApi.togglePopupOpened(true);
        return;
      }

      if (needsLogin) {
        await resetSelectedVendor();
      }
      basePublishApi.onPublish(versionName);
    },
    [needsLogin, vendors]
  );

  useSetup(() => loadAccount());

  return {
    ...basePublishApi,
    onPublish,
  };
};
