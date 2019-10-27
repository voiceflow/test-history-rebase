import React from 'react';

import { googleIDSelector } from '@/ducks/publish/google';
import { connect } from '@/hocs';

import { UploadPromptWrapper } from '../styled';

const UploadSuccess = (props) => {
  const { googleID } = props;

  return (
    <UploadPromptWrapper>
      <div className="d-flex align-items-center justify-content-center upload-prompt-title mb-2">
        {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
        <span className="pass-icon mr-2" /> Action Upload Successful
      </div>
      <div className="upload-prompt-text">
        You may test on the{' '}
        <a href={`https://console.actions.google.com/u/0/project/${googleID}/simulator`} target="_blank" rel="noopener noreferrer">
          Google Actions Simulator
        </a>
        . To submit for review, please follow the instructions on the Google Actions Developer Console.
      </div>
    </UploadPromptWrapper>
  );
};

const mapStateToProps = {
  googleID: googleIDSelector,
};

export default connect(mapStateToProps)(UploadSuccess);
