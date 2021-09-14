import React from 'react';

import { GoogleStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { useDispatch, useSelector, useSetup } from '@/hooks';
import { GooglePublishJob } from '@/models';

import { BasePublishApi, OnStateChangedOptions, useBasePublish } from './basePublish';

export interface GooglePublishApi extends BasePublishApi<GooglePublishJob.AnyJob> {
  multiProjects: boolean;
  setMultiProjects: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useGooglePublish = (): GooglePublishApi => {
  const google = useSelector(Account.googleAccountSelector);

  const loadGoogleAccount = useDispatch(Account.google.loadAccount);

  const needsLogin = !google;

  const [multiProjects, setMultiProjects] = React.useState(false);

  const onStateChanged = React.useCallback(({ stageType }: OnStateChangedOptions<GoogleStageType>) => {
    // reset multiProjects when the job finishes,
    // user should be able to select vendor on every upload attempt
    if (stageType === GoogleStageType.SUCCESS || stageType === GoogleStageType.ERROR) {
      setMultiProjects(false);
    }
  }, []);

  const basePublishApi = useBasePublish<typeof GoogleStageType, GooglePublishJob.AnyJob>({
    StageType: GoogleStageType,
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
