import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

import { UploadPromptWrapper } from '../styled';

// When the upload process encounters an amazon error
const AmazonError = ({ error }) => (
  <UploadPromptWrapper>
    <div className="super-center">
      <span className="fail-icon mr-2" />
      Amazon Error Response
    </div>
    <Alert color="danger" className="my-2 w-100">
      {error}
    </Alert>
    <Alert className="w-100 mb-0">
      Amazon responded with an error, Visit our{' '}
      <u>
        <a href="https://www.facebook.com/groups/voiceflowgroup">community</a>
      </u>{' '}
      or contact us
    </Alert>
  </UploadPromptWrapper>
);

export default connect((state) => ({ error: state.publish.alexa.error }))(AmazonError);
