import { ProjectSecretTag } from '@voiceflow/schema-types';
import { toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { JobStatus } from '@/constants';
import { NLPTrainStageType } from '@/constants/platforms';
import { PublishContext } from '@/contexts/PublishContext';
import * as Project from '@/ducks/projectV2';
import { activeProjectIDSelector } from '@/ducks/session';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

const checkConfiguration = async (activeProjectID: string) => {
  const requiredSecrets = [ProjectSecretTag.MICROSOFT_TEAMS_APP_ID, ProjectSecretTag.MICROSOFT_TEAMS_APP_PASSWORD];

  const secretVals = await client.apiV3.projectSecret.findManyByProjectID(activeProjectID, requiredSecrets);

  return requiredSecrets.every((reqTag) => {
    const val = secretVals.find((secret) => secret.tag === reqTag);
    return !!val && val.secret.length > 0;
  });
};

export const useTeamsPublish = () => {
  const activeProjectID = useSelector(activeProjectIDSelector)!;
  const updateProjectLiveVersion = useDispatch(Project.updateProjectLiveVersion);

  const publishContext = React.useContext(PublishContext);
  const publishNewVersionModal = ModalsV2.useModal(ModalsV2.Publish.NewVersion);

  const onPublish = usePersistFunction(async () => {
    const configurationDone = await checkConfiguration(activeProjectID);

    // Create fake success job to trigger a dropdown asking for configuration from the user.
    if (!configurationDone) {
      publishContext.setJob({
        id: 'configuration-job',
        stage: { type: NLPTrainStageType.SUCCESS, data: { configurationRequired: true } },
        status: JobStatus.FINISHED,
      });

      return;
    }

    // Proceed with the normal publish flow if user provided Teams configuration info
    try {
      const { versionName } = await publishNewVersionModal.open({
        message: 'Publish this version to production and use it on Microsoft Teams.',
      });

      try {
        await publishContext?.start({ versionName });

        const { liveVersion } = await client.api.project.get(activeProjectID!, ['liveVersion']);

        updateProjectLiveVersion(activeProjectID, liveVersion!);
      } catch (err) {
        toast.error(`Updating live version failed: ${err}`);
      }
    } catch {
      // cancelled
    }
  });

  return {
    onPublish,
  };
};
