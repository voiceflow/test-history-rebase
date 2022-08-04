import { StatusCode } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { DialogflowPublishJob, JobStageData } from '@/models';
import { makeGoogleCloudPermissionError } from '@/platforms/errors';

export const DEFAULT_ERROR_MESSAGE = 'Dialogflow is experiencing heavy traffic, please wait a moment and try again';

export const errorMap = (stageError: JobStageData<DialogflowPublishJob.ErrorStage>) => {
  if (stageError.googleError && stageError.statusCode === StatusCode.FORBIDDEN) {
    return makeGoogleCloudPermissionError(VoiceflowConstants.PlatformType.DIALOGFLOW_ES);
  }

  return null;
};
