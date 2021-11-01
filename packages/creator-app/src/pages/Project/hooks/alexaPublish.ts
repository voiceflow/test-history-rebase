import React from 'react';

import { AlexaStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { useDidUpdateEffect, useDispatch, useSelector, useSetup } from '@/hooks';
import { AlexaPublishJob } from '@/models';
import { isFinished } from '@/utils/job';

import { BasePublishApi, OnStateChangedOptions, useBasePublish } from './basePublish';

export interface AlexaPublishApi extends BasePublishApi<AlexaPublishJob.AnyJob> {
  vendorSelected: boolean;
  showSelectVendor: boolean;
  setVendorSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useAlexaPublish = (): AlexaPublishApi => {
  const amazon = useSelector(Account.amazonAccountSelector);
  const vendors = useSelector(Account.amazonVendorsSelector);

  const syncSelectedVendor = useDispatch(Account.amazon.syncSelectedVendor);

  const needsLogin = !amazon;
  const multiVendors = vendors.length > 1;

  const [vendorSelected, setVendorSelected] = React.useState(!multiVendors);

  const onStateChanged = React.useCallback(
    ({ cancel, stageType, popupOpened }: OnStateChangedOptions<AlexaStageType>) => {
      // let the user select vendor before proceeding
      if (popupOpened && !vendorSelected && stageType === AlexaStageType.PROGRESS) {
        cancel();
      }

      // reset vendorSelected when the job finishes,
      // user should be able to select vendor on every upload attempt
      if (stageType === AlexaStageType.SUCCESS || stageType === AlexaStageType.ERROR) {
        setVendorSelected(!multiVendors);
      }
    },
    [vendorSelected]
  );

  const basePublishApi = useBasePublish<typeof AlexaStageType, AlexaPublishJob.AnyJob>({
    StageType: AlexaStageType,
    needsLogin,
    canBePublished: vendorSelected,
    onStateChanged,
  });

  const showSelectVendor = !vendorSelected && !isFinished(basePublishApi.job);

  useSetup(() => syncSelectedVendor());

  useDidUpdateEffect(() => {
    setVendorSelected(!multiVendors);
  }, [multiVendors]);

  return {
    ...basePublishApi,
    vendorSelected,
    showSelectVendor,
    setVendorSelected,
  };
};
