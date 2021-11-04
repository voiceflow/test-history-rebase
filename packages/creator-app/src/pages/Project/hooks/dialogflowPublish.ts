import React from 'react';

import { ModalType } from '@/constants';
import { DialogflowStageType } from '@/constants/platforms';
import { PublishContext } from '@/contexts';
import * as Account from '@/ducks/account';
import * as Version from '@/ducks/version';
import { useDispatch, useModals, useSelector, useSetup } from '@/hooks';
import { DialogflowPublishJob } from '@/models';

import { BasePublishApi, OnStateChangedOptions, useBasePublish } from './basePublish';

export interface DialogflowPublishApi extends BasePublishApi<DialogflowPublishJob.AnyJob> {
  multiProjects: boolean;
  setMultiProjects: React.Dispatch<React.SetStateAction<boolean>>;
  createNewAgent: () => void;
  createNewAgentModalOpened: boolean;
}

export const useDialogflowPublish = (): DialogflowPublishApi => {
  const google = useSelector(Account.googleAccountSelector);
  const updateAgentName = useDispatch(Version.dialogflow.updateAgentName);

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

  const {
    open: openAgentNameModal,
    close: closeAgentNameModal,
    isOpened: createNewAgentModalOpened,
  } = useModals(ModalType.DIALOGFLOW_CREATE_NEW_AGENT);
  const { updateCurrentStage } = React.useContext(PublishContext)!;

  const createNewAgent = () =>
    openAgentNameModal({
      onCancel: () => {
        basePublishApi.onCancel();
        closeAgentNameModal();
      },
      onSubmit: async (agentName: string) => {
        await updateAgentName(agentName);
        await updateCurrentStage(null);
        closeAgentNameModal();
      },
    });

  useSetup(() => loadGoogleAccount());

  return {
    ...basePublishApi,
    multiProjects,
    setMultiProjects,
    createNewAgent,
    createNewAgentModalOpened,
  };
};
