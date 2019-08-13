import axios from 'axios';
import React from 'react';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';

import { GOOGLE_STAGES } from '../Constants';
import { loading } from '../utils';

export default function GoogleBody({ modal, updateGoogle, stateProps: { google_stage, google_id, is_first_upload }, skill }) {
  let modal_content = null;

  if (google_stage === 3 || google_stage === 4) {
    modal_content = loading(GOOGLE_STAGES[google_stage]);
  } else if (google_stage === 5) {
    if (!modal) {
      modal_content = (
        <div className="text-center">
          <div className="d-flex align-items-center justify-content-center upload-prompt-title mb-2">
            <span className="pass-icon mr-2" /> Upload Successful
          </div>
          <div className="upload-prompt-text">
            You may test on the{' '}
            <a
              href={`https://console.actions.google.com/u/${skill.google_publish_info.google_link_user || '0'}/project/${google_id}/simulator`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Actions Simulator
            </a>
            . To submit for review, please follow the instructions on the Google Actions Developer Console.
          </div>
        </div>
      );
    } else {
      modal_content = (
        <>
          <img src="/images/clipboard-icon.svg" alt="Success" height="160" />
          <br />
          <span className="modal-bg-txt text-center mb-2"> Successfully uploaded to Google Actions </span>
          <span className="modal-txt text-center">
            You may test on the Google Actions Simulator. To submit for review, please follow the instructions on the Google Actions Developer
            Console.
          </span>
          <div className="my-3">
            <a
              href={`https://console.actions.google.com/u/${skill.google_publish_info.google_link_user || '0'}/project/${google_id}/simulator`}
              className="btn btn-primary mr-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Test on Google Actions Simulator
            </a>
          </div>
        </>
      );
    }
  } else {
    if (is_first_upload) {
      axios.post('/analytics/track_dev_account').catch((err) => {
        console.error(err);
      });
    }
    modal_content = (
      <div>
        <img className="modal-img mb-3 mx-auto" src="/upload.svg" alt="Upload" />
        <div className="modal-bg-txt text-center mt-2"> Upload your Action for testing</div>
        <div className="modal-txt text-center mt-2">
          Updating to Google will allow you to test on your Google device or the Google Actions Console.
        </div>
        {(skill.live || skill.review) && <hr />}
        <div>
          {skill.google_publish_info && skill.google_publish_info.live && (
            <Alert color="danger">This Action is in production, updating will change the flow for all production users</Alert>
          )}
          {skill.google_publish_info && skill.google_publish_info.review && (
            <Alert color="danger">This Action is under review, updating will change the flow during the review process</Alert>
          )}
        </div>

        <div className="super-center mb-3 mt-3">
          <Button isPrimary onClick={updateGoogle}>
            Confirm Upload
          </Button>
        </div>
      </div>
    );
  }
  return modal_content;
}
