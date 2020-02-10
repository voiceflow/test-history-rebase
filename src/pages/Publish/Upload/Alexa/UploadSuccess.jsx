import React, { useEffect, useState } from 'react';
import BaseConfetti from 'react-dom-confetti';
import { Alert } from 'reactstrap';

import { userIDSelector } from '@/ducks/account';
import { amznIDSelector, publishStateSelector } from '@/ducks/publish/alexa';
import { activeLocalesSelector, invNameSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

import { UploadPromptWrapper } from '../styled';

const Video = ({ link }) => (
  <div className="mt-3 rounded overflow-hidden mx-2">
    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
    <video className="rounded w-100 overflow-hidden" controls>
      <source src={link} type="video/mp4" />
    </video>
  </div>
);

const UploadSuccess = (props) => {
  const { amznID, invName, locales, publishState, userID } = props;

  const [firstSession] = useState(localStorage.getItem(`is_first_session_${userID}`) !== 'false');

  useEffect(() => {
    localStorage.setItem(`is_first_session_${userID}`, false);
  }, []);

  // eslint-disable-next-line no-case-declarations
  const locale = (publishState.succeedLocale || locales[0] || 'en-US').replace('-', '_');

  if (firstSession) {
    return (
      <UploadPromptWrapper>
        {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
        <div className="d-flex justify-content-center">
          <label className="success-label">Upload Successful</label>
        </div>
        <Video link="https://s3.amazonaws.com/com.getvoiceflow.videos/loomopt.mp4" />
        <div className="text-muted text-center mt-3">You may test on the Alexa simulator or live on your personal Alexa device</div>
        {!!publishState.succeedLocale && <Alert className="mb-0 mt-3 text-center mx-2">Alexa, open {invName}</Alert>}
        <div className="my-45">
          <a
            href={`https://developer.amazon.com/alexa/console/ask/test/${amznID}/development/${locale}/`}
            className="btn-primary mr-2 no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Test on Alexa Simulator
          </a>
        </div>
        <div id="confetti-positioner">
          <BaseConfetti
            active={true}
            config={{
              angle: 90,
              spread: 70,
              startVelocity: 50,
              elementCount: 75,
              dragFriction: 0.05,
              duration: 8000,
              delay: 0,
            }}
          />
        </div>
      </UploadPromptWrapper>
    );
  }

  return (
    <UploadPromptWrapper>
      <div className="d-flex align-items-center justify-content-center upload-prompt-title">
        {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
        <label className="success-label">Upload Successful</label>
      </div>
      <div className="text-muted mb-2">
        Your Skill is now available to test on your Alexa and the{' '}
        <a href={`https://developer.amazon.com/alexa/console/ask/test/${amznID}/development/${locale}/`} target="_blank" rel="noopener noreferrer">
          Amazon console
        </a>
        .
      </div>
    </UploadPromptWrapper>
  );
};

export default connect({
  locales: activeLocalesSelector,
  invName: invNameSelector,
  amznID: amznIDSelector,
  userID: userIDSelector,
  publishState: publishStateSelector,
})(UploadSuccess);
