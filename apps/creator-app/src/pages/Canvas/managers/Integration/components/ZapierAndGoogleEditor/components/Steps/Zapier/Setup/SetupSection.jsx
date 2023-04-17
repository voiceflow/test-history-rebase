import React from 'react';

import ClipBoard from '@/components/ClipBoard/ClipBoard';
import { ZAPIER_PATH } from '@/config';

import NextStepButton from '../../components/NextStepButton';

const ZAPIER_INVITE_ENDPOINT = `https://zapier.com/developer/public-invite/${ZAPIER_PATH}/`;

const SetupSection = (props) => {
  const { apiKey, openNextStep } = props;
  const integrationsUser = props.data.user;
  const feed = integrationsUser && integrationsUser.user_id;
  return (
    <>
      <div className="d-flex flex-column mb-3 text-dark">
        <div className="d-flex flex-row w-100 align-items-center">
          <div className="d-flex flex-fill" style={{ overflow: 'auto' }}>
            <ol>
              <li className="mb-3">
                Join the Voiceflow Zapier Beta{' '}
                <a href={ZAPIER_INVITE_ENDPOINT} target="_blank" rel="noopener noreferrer">
                  here
                </a>
              </li>
              <li className="mb-3">
                Create a Zap using trigger app <b>Voiceflow</b>
              </li>
              <li className="mb-3">
                <div className="mb-2">Connect your account with this API key</div>
                <ClipBoard name="key" component="button" value={apiKey} id="shareKey" />
              </li>
              <li>
                Select trigger <code>{feed}</code>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <NextStepButton openNextStep={openNextStep} />
    </>
  );
};

export default SetupSection;
