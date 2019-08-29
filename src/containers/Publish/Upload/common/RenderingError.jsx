import React from 'react';
import { Alert } from 'reactstrap';

import { UploadPromptWrapper } from '../styled';

const RenderingError = () => (
  <UploadPromptWrapper>
    <div className="super-center">
      <span className="fail-icon mr-2" />
      Rendering Error
    </div>
    <Alert color="danger mb-0 mt-2 w-100">project structure unable to build, please contact us on Intercom</Alert>
  </UploadPromptWrapper>
);

export default RenderingError;
