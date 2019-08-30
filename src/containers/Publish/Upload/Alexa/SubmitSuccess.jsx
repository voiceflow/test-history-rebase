import React from 'react';

import { UploadPromptWrapper } from '../styled';

const SubmitSuccess = () => (
  <UploadPromptWrapper>
    <img id="rocket" alt="submitted" height={120} src="/images/icons/takeoff.svg" />
    <div className="px-3 mt-4 text-dull">
      Your project has been submitted for review. During this time you will see the skill with the "Review" status.
    </div>
  </UploadPromptWrapper>
);

export default SubmitSuccess;
