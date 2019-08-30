import React, { useEffect, useState } from 'react';
import BaseConfetti from 'react-dom-confetti';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

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
  const { skill, succeedLocale, creator_id } = props;

  const [firstSession] = useState(localStorage.getItem(`is_first_session_${creator_id}`) !== 'false');

  useEffect(() => {
    localStorage.setItem(`is_first_session_${creator_id}`, false);
  }, []);

  // eslint-disable-next-line no-case-declarations
  const locale = (succeedLocale || skill.locales[0] || 'en-US').replace('-', '_');

  if (firstSession) {
    return (
      <UploadPromptWrapper>
        {/* eslint-disable-next-line sonarjs/no-duplicate-string */}
        <div className="d-flex align-items-center justify-content-center">
          <span className="pass-icon mr-2" /> Upload Successful
        </div>
        <Video link="https://s3.amazonaws.com/com.getvoiceflow.videos/loomopt.mp4" />
        <div className="modal-txt text-center mt-3">You may test on the Alexa simulator or live on your personal Alexa device</div>
        {!!succeedLocale && (
          <Alert className="mb-0 mt-3 text-center mx-2">
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
    </UploadPromptWrapper>
  );
};

export default connect((state) => ({
  skill: state.skills.skill,
  creator_id: state.account.creator_id,
  succeedLocale: state.publish.alexa.locale,
}))(UploadSuccess);
