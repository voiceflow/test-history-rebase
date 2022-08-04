import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

export const makeGoogleCloudPermissionError = (platform: VoiceflowConstants.PlatformType.DIALOGFLOW_ES | VoiceflowConstants.PlatformType.GOOGLE) => {
  const projectType = platform === VoiceflowConstants.PlatformType.DIALOGFLOW_ES ? 'the Dialogflow agent' : 'Google Actions';

  return (
    <div>
      Received Google Cloud Platform permissions error.
      <br />
      <br />
      Contact your administrator and ensure you have sufficient IAM permissions to access the Google Cloud project associated with {projectType}
    </div>
  );
};
