import React from 'react';
import { connect } from 'react-redux';

import { UploadPromptWrapper } from '../styled';

const UploadSuccess = (props) => {
  const { google_id } = props;

  return (
    <UploadPromptWrapper>
      <img src="/images/preview.svg" alt="Success" height="160" />
      <br />
      Your Action Has been uploaded to Google Actions!
      <br />
      <span className="text-muted text-center">
        You may test on the Google Actions Simulator. To submit for review, please follow the instructions on the Google Actions Developer Console.
      </span>
      <div className="my-3">
        <a
          href={`https://console.actions.google.com/u/0/project/${google_id}/simulator`}
          className="btn btn-primary mb-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          Test on Google Actions Simulator
        </a>
        <br />
        <a
          href="http://learn.voiceflow.com/advanced-voiceflow-tutorials/uploading-your-project-to-google-assistant"
          className="btn btn-default"
          target="_blank"
          rel="noopener noreferrer"
        >
          Submit for Review
        </a>
      </div>
    </UploadPromptWrapper>
  );
};

export default connect((state) => ({
  google_id: state.publish.google.google_id,
}))(UploadSuccess);
