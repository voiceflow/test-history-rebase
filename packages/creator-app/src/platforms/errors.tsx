import * as Platform from '@voiceflow/platform-config';
import React from 'react';

export const makeGoogleCloudPermissionError = (
  platform: typeof Platform.Constants.PlatformType.DIALOGFLOW_ES | typeof Platform.Constants.PlatformType.GOOGLE
) => {
  const projectType = platform === Platform.Constants.PlatformType.DIALOGFLOW_ES ? 'the Dialogflow agent' : 'Google Actions';

  return (
    <div>
      Received Google Cloud Platform permissions error.
      <br />
      <br />
      Contact your administrator and ensure you have sufficient IAM permissions to access the Google Cloud project associated with {projectType}
    </div>
  );
};
