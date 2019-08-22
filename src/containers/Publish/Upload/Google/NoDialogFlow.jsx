import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { Alert, Button as ReactstrapButton, FormGroup, Input, Label } from 'reactstrap';

import { Spinner } from '@/components/Spinner';
import Button from '@/componentsV2/Button';
import { setConfirm } from '@/ducks/modal';
import { checkDialogflow, linkDialogflowCredential, resetDialogflowCredential } from '@/ducks/publish/google';

import { PopUpText, PopupButtonSection, UploadPromptWrapper } from '../styled';

const MAX_SIZE = 10 * 1024 * 1024;

// Missing Dialogflow Credentials
const NoDialogFlow = ({ credentials, google_id, setConfirm, resetDialogflowCredential, linkDialogflowCredential, error, checkDialogflow }) => {
  const [loading, setLoading] = useState(false);

  const unlink = () => {
    setConfirm({
      warning: true,
      text: (
        <Alert color="warning" className="mb-0">
          Are you sure you want to unlink the google project {google_id}? You will be able to link a new google project afterwards.
        </Alert>
      ),
      confirm: async () => {
        setLoading(true);
        await resetDialogflowCredential();
        setLoading(false);
      },
    });
  };

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
      <img src="/Support.svg" alt="" />
      <PopUpText>
        Please provide Dialogflow Credentials
        <FormGroup className="mb-4">
          <Dropzone
            className={`dropzone google-upload ${canLink ? '' : 'disabled'}`}
            activeClassName="active"
            rejectClassName="reject"
            multiple={false}
            disableClick={false}
            maxSize={MAX_SIZE}
            onDrop={link}
            disabled={!canLink}
          >
            {canLink && !loading && (
              <div className="drop-child">
                Drag and Drop your file here
                <br />
                <small className="d-inline-block mt-2">OR</small>
                <br />
                <div className="pg__add_file_button">
                  <Button variant="primary" type="button" className="mt-2">
                    Add File
                  </Button>
                </div>
              </div>
            )}
            {loading && (
              <div className="d-flex publish-loader">
                <Spinner isEmpty />
              </div>
            )}
            {credentials && !error && (
              <div className="align-self-center mx-2 d-flex">
                <i className="fal fa-check-circle text-success align-self-center mx-2" />
                <span>
                  <Label>File uploaded</Label>
                </span>
              </div>
            )}
            {error && (
              <div className="rejected-file text-danger">
                <b>File not Accepted</b>
                {error}
              </div>
            )}
          </Dropzone>
        </FormGroup>
        {credentials && (
          <FormGroup>
            <Label className="publish-label">Google Project ID</Label>
            <Input className="form-bg" type="text" name="project_id" placeholder="No Project ID Found" value={google_id} readOnly />
          </FormGroup>
        )}
        {credentials && (
          <ReactstrapButton className="w-100" color="danger" onClick={unlink}>
            {loading ? <span className="loader" /> : 'Unlink Google Project'}
          </ReactstrapButton>
        )}
      </PopUpText>
      <PopupButtonSection>
        <Button variant="primary" onClick={checkDialogflow} disabled={!credentials}>
          Next
        </Button>
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
  { setConfirm, resetDialogflowCredential, linkDialogflowCredential, checkDialogflow }
)(NoDialogFlow);
