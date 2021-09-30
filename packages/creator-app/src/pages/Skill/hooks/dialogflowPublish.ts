import React from 'react';

import { DialogflowStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { useDispatch, useSelector, useSetup } from '@/hooks';
import { DialogflowPublishJob } from '@/models';

import { BasePublishApi, OnStateChangedOptions, useBasePublish } from './basePublish';

export interface DialogflowPublishApi extends BasePublishApi<DialogflowPublishJob.AnyJob> {
  multiProjects: boolean;
  setMultiProjects: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDialogflowPublish = (): DialogflowPublishApi => {
  const google = useSelector(Account.googleAccountSelector);

  const loadGoogleAccount = useDispatch(Account.google.loadAccount);

  const needsLogin = !google;

  const [multiProjects, setMultiProjects] = React.useState(false);

  const onStateChanged = React.useCallback(({ stageType }: OnStateChangedOptions<DialogflowStageType>) => {
    // reset multiProjects when the job finishes,
    // user should be able to select vendor on every upload attempt
    if (stageType === DialogflowStageType.SUCCESS || stageType === DialogflowStageType.ERROR) {
      setMultiProjects(false);
    }
  }, []);

  const basePublishApi = useBasePublish<typeof DialogflowStageType, DialogflowPublishJob.AnyJob>({
    StageType: DialogflowStageType,
    needsLogin,
    onStateChanged,
  });

  useSetup(() => loadGoogleAccount());

  return {
    ...basePublishApi,
    multiProjects,
    setMultiProjects,
  };
};
