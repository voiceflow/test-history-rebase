import { ProjectSecretTag } from '@voiceflow/schema-types';
import { toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { PublishVersionModalData } from '@/components/PublishVersionModal';
import { JobStatus, ModalType } from '@/constants';
import { NLPTrainStageType } from '@/constants/platforms';
import { PublishContext } from '@/contexts/PublishContext';
import * as Project from '@/ducks/project';
import { activeProjectIDSelector } from '@/ducks/session';
import { useDispatch, useModals, useSelector } from '@/hooks';

const usePublishCall = (activeProjectID: string) => {
  const publishContext = React.useContext(PublishContext)!;

  const updateProjectLiveVersion = useDispatch(Project.updateProjectLiveVersion);

  return usePersistFunction((versionName: string) => {
    (async () => {
      try {
        await publishContext?.start({ versionName });

        const { liveVersion } = await client.api.project.get(activeProjectID!, ['liveVersion']);
        updateProjectLiveVersion(activeProjectID, liveVersion!);
      } catch (err) {
        toast.error(`Updating live version failed: ${err}`);
      }
    })();
  });
};

const checkConfiguration = async (activeProjectID: string) => {
  const requiredSecrets = [ProjectSecretTag.MICROSOFT_TEAMS_APP_ID, ProjectSecretTag.MICROSOFT_TEAMS_APP_PASSWORD];

  const secretVals = await client.apiV3.projectSecret.findManyByProjectID(activeProjectID, requiredSecrets);

  return requiredSecrets.every((reqTag) => {
    const val = secretVals.find((secret) => secret.tag === reqTag);
    return !!val && val.secret.length > 0;
  });
};

const usePublishModal = (activeProjectID: string, onConfirm: (versionName: string) => void) => {
  const publishContext = React.useContext(PublishContext)!;

  const publishNewVersionModal = useModals<PublishVersionModalData>(ModalType.PUBLISH_VERSION_MODAL);

  return usePersistFunction(async () => {
    const configurationDone = await checkConfiguration(activeProjectID);

    // Proceed with the normal publish flow if user provided Teams configuration info
    if (configurationDone) {
      return publishNewVersionModal.open({
        message: 'Publish this version to production and use it on Microsoft Teams.',
        onConfirm,
      });
    }

    // Create fake success job to trigger a dropdown asking for configuration from the user.
    publishContext.setJob({
      id: 'configuration-job',
      stage: {
        type: NLPTrainStageType.SUCCESS,
        data: {
          configurationRequired: true,
        },
      },
      status: JobStatus.FINISHED,
    });
  });
};

export const useTeamsPublish = () => {
  const activeProjectID = useSelector(activeProjectIDSelector)!;

  const publishTeamsVersion = usePublishCall(activeProjectID);

  const openTeamModal = usePublishModal(activeProjectID, publishTeamsVersion);

  return {
    onPublish: openTeamModal,
  };
};
