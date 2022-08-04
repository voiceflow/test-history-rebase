import { StatusCode } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { GooglePublishJob, JobStageData } from '@/models';
import { makeGoogleCloudPermissionError } from '@/platforms/errors';

export const errorMap = (stageError: JobStageData<GooglePublishJob.ErrorStage>) => {
  if (stageError.googleError && stageError.statusCode === StatusCode.FORBIDDEN) {
    return makeGoogleCloudPermissionError(VoiceflowConstants.PlatformType.GOOGLE);
  }

  return null;
};
