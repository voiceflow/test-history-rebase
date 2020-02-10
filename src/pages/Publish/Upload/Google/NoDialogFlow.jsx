/* eslint-disable no-secrets/no-secrets */
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { Alert, FormGroup } from 'reactstrap';

import Button from '@/components/Button';
import { LoadCircle } from '@/components/Loader';
import { checkDialogflow, linkDialogflowCredential } from '@/ducks/publish/google';

import { PopUpText, PopupButtonSection, UploadPromptWrapper } from '../styled';

const MAX_SIZE = 10 * 1024 * 1024;

const HelpLink = ({ children }) => (
  <a
    href="https://docs.voiceflow.com/voiceflow-documentation/cross-platform-work/uploading-your-project-to-google-assistant"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

// Missing Dialogflow Credentials
const NoDialogFlow = ({ credentials, linkDialogflowCredential, error, checkDialogflow }) => {
  const [loading, setLoading] = useState(false);

  const link = (files) => {
    if (files.length === 1) {
      setLoading(true);
      // eslint-disable-next-line compat/compat
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        await linkDialogflowCredential(text);
        setLoading(false);
      };
      reader.readAsText(files[0], 'UTF-8');
    }
  };

  const canLink = !credentials || error;

  return (
    <UploadPromptWrapper>
      {error && (
        <Alert color="danger" className="my-2 w-100">
          Invalid Dialogflow Credentials, try creating new file
        </Alert>
      )}
      <PopUpText>
        Please provide Dialogflow Credentials Setup instructions can be found <HelpLink>here</HelpLink>
      </PopUpText>
      <FormGroup className="mb-5">
        <Dropzone
          className={`dropzone google-upload ${canLink ? '' : 'disabled'}`}
          activeClassName="active"
          rejectClassName="reject"
          multiple={false}
          disableClick={false}
          maxSize={MAX_SIZE}
          onDrop={link}
          disabled={!canLink || loading}
        >
          {canLink && !loading && (
            <div className="text-dull">
              Drop JSON file here or <span className="btn-link">Browse</span>
            </div>
          )}
          {loading && (
            <div className="text-dull">
              <LoadCircle color="transparent" style={{ position: 'absolute', left: 25, top: 25 }} />
              Upload
            </div>
          )}
          {credentials && !error && (
            <div className="align-self-center mx-2 d-flex">
              <i className="fal fa-check-circle text-success align-self-center mx-2" />
              <span>Successfully Uploaded</span>
            </div>
          )}
          {error && (
            <div className="rejected-file text-danger">
              <b>File not Accepted</b>
            </div>
          )}
        </Dropzone>
      </FormGroup>
      <PopupButtonSection>
        <Button variant="primary" onClick={checkDialogflow} disabled={!credentials}>
          Upload
        </Button>
        <HelpLink>Setup tutorial</HelpLink>
      </PopupButtonSection>
    </UploadPromptWrapper>
  );
};

const mapStateToProps = (state) => ({
  google_id: state.publish.google.google_id,
  credentials: state.publish.google.credentials,
  error: state.publish.google.error,
});

export default connect(
  mapStateToProps,
  { linkDialogflowCredential, checkDialogflow }
)(NoDialogFlow);
