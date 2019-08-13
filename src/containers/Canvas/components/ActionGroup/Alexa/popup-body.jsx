import axios from 'axios';
import React, { PureComponent } from 'react';
import { Tooltip } from 'react-tippy';
import { Alert } from 'reactstrap';

import AmazonLogin from '@/components/Forms/AmazonLogin';
import Button from '@/componentsV2/Button';

import { Video, loading } from '../utils';
import { PopUpLink, PopUpText, PopupButtonSection, UploadPromptWrapper } from './styled';

export default class AlexaBody extends PureComponent {
  render() {
    const {
      modal,
      succeedLocale,
      onInvocatonNameChange,
      updateAlexa,
      onConfirmUpload,
      toggle_upload_prompt,
      stateProps: { stage, amzn_error, upload_error, inv_name, is_first_upload, inv_name_error },
      skill,
    } = this.props;

    if (!skill.locales) {
      return null;
    }

    switch (stage) {
      case 1:
        return loading('Rendering Flows');
      case 2:
        // eslint-disable-next-line no-case-declarations
        const locale = (succeedLocale || skill.locales[0] || 'en-US').replace('-', '_');

        if (!modal) {
          return (
            <div className="text-center">
              <div className="d-flex align-items-center justify-content-center upload-prompt-title mb-2">
                {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
                <span className="pass-icon mr-2" /> Upload Successful
              </div>
              <div className="upload-prompt-text">
                Your Skill is now available to test on your Alexa and the{' '}
                <a
                  href={`https://developer.amazon.com/alexa/console/ask/test/${skill.amzn_id}/development/${locale}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Amazon console
                </a>
                .
              </div>
            </div>
          );
        }
        return (
          <>
            {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
            <div className="d-flex align-items-center justify-content-center">
              <span className="pass-icon mr-2" /> Upload Successful
            </div>
            {Video('https://s3.amazonaws.com/com.getvoiceflow.videos/loomopt.mp4', 'w-90')}
            <span className="modal-txt text-center mt-3">You may test on the Alexa simulator or live on your personal Alexa device</span>
            {!!succeedLocale && (
              <Alert className="w-75 mb-1 mt-3 text-center">
                <b>Alexa,</b> open {skill.inv_name}
              </Alert>
            )}
            <div className="my-45">
              <a
                href={`https://developer.amazon.com/alexa/console/ask/test/${skill.amzn_id}/development/${locale}/`}
                className="btn-primary mr-2 no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Test on Alexa Simulator
              </a>
            </div>
          </>
        );
      case 4:
        return (
          <Alert color="danger mb-0 w-90">
            <span className="fail-icon" /> Rendering Error
          </Alert>
        );
      case 5:
        return (
          <UploadPromptWrapper>
            {amzn_error && (
              <Alert color="danger">
                <span className="fail-icon" /> Login With Amazon Failed - Try Again
              </Alert>
            )}
            <UploadPromptWrapper disablePadding={!amzn_error}>
              <img src="/Connect-account.svg" alt="" />
              <PopUpText>Please connect your Amazon developer account to upload your skill to Alexa.</PopUpText>
            </UploadPromptWrapper>
            {/* {modal && Video('https://s3.amazonaws.com/com.getvoiceflow.videos/first.mp4')} */}
            <PopupButtonSection>
              <AmazonLogin updateLogin={this.amazonLogin} small />
            </PopupButtonSection>
          </UploadPromptWrapper>
        );
      case 6:
        return (
          <UploadPromptWrapper>
            <img src="/Support.svg" alt="" />
            <PopUpText>Looks like you dont have a developer account, create one to get started!</PopUpText>
            <PopupButtonSection>
              <PopUpLink
                href="https://developer.amazon.com/login.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => toggle_upload_prompt(false)}
              >
                <Button variant="primary">Developer Sign Up</Button>
              </PopUpLink>
            </PopupButtonSection>
          </UploadPromptWrapper>
        );
      case 7:
        return loading('Checking Vendor');
      case 8:
        return loading('Verifying Login');
      case 9:
        return (
          <UploadPromptWrapper>
            <div className="d-flex align-items-center justify-content-center">
              <span className="fail-icon mr-2" />
              Amazon Error Response
            </div>
            <Alert color="danger" className="mt-1">
              {upload_error}
            </Alert>
            <Alert>
              Amazon responded with an error, Visit our{' '}
              <u>
                <a href="https://forum.voiceflow.com">community</a>
              </u>{' '}
              or contact us for help
            </Alert>
          </UploadPromptWrapper>
        );
      case 11:
        return loading('Uploading to Alexa');
      case 12:
        return loading('Building Interaction Model');
      case 13:
        return loading('Enabling Skill');
      case 14:
        return (
          <UploadPromptWrapper>
            <div className="d-flex text-muted align-items-center">
              <label className="mr-1">Invocation Name</label>
              <Tooltip
                html={
                  <>
                    Alexa listens for the Invocation Name
                    <br /> to launch your Skill
                    <br /> e.g.{' '}
                    <i>
                      Alexa, open <b>Invocation Name</b>
                    </i>
                  </>
                }
                position="bottom"
              >
                <i className="fal fa-question-circle" />
              </Tooltip>
            </div>
            <input className="form-control" value={inv_name} placeholder="Invocation Name" onChange={onInvocatonNameChange} />
            <PopUpText align="left">
              <small>{inv_name_error}</small>
            </PopUpText>
            <PopupButtonSection>
              <Button isPrimary onClick={updateAlexa} disabled={inv_name_error}>
                Continue
              </Button>
            </PopupButtonSection>
          </UploadPromptWrapper>
        );
      default:
        if (is_first_upload) {
          axios.post('/analytics/track_dev_account').catch((err) => {
            console.error(err);
          });
        }

        onConfirmUpload();

        return loading('Uploading to Alexa');
    }
  }

  amazonLogin = (result) => {
    const { updateAlexaStage, setAmazonToken } = this.props;
    if (result === 2) {
      this.fetchVendors();
      setAmazonToken();
    } else if (result === 1) {
      updateAlexaStage(8);
    } else {
      updateAlexaStage(5, undefined, { amzn_error: true });
    }
  };

  fetchVendors = async () => {
    const { getVendors, updateAlexaStage } = this.props;

    updateAlexaStage(7);
    await getVendors();
    this.checkVendors();
  };

  checkVendors = () => {
    const { vendors, updateAlexaStage } = this.props;

    if (vendors.length === 0) {
      updateAlexaStage(6);
    } else {
      updateAlexaStage(0);
    }
  };
}
