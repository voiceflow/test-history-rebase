import React from 'react';
import { connect } from 'react-redux';

import { UploadPromptWrapper } from '../styled';

const UploadSuccess = (props) => {
  const { google_id } = props;

  return (
    <UploadPromptWrapper>
      <div className="d-flex align-items-center justify-content-center upload-prompt-title mb-2">
        {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
        <span className="pass-icon mr-2" /> Action Upload Successful
      </div>
      <div className="upload-prompt-text">
        You may test on the{' '}
        <a href={`https://console.actions.google.com/u/0/project/${google_id}/simulator`} target="_blank" rel="noopener noreferrer">
          Google Actions Simulator
        </a>
        . To submit for review, please follow the instructions on the Google Actions Developer Console.
      </div>
    </UploadPromptWrapper>
  );
};

export default connect((state) => ({
  google_id: state.publish.google.google_id,
}))(UploadSuccess);
