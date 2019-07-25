import React from 'react';
import { Collapse } from 'reactstrap';

import Button from '@/components/Button';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import { ZAPIER_PATH } from '@/config';

const ZAPIER_INVITE_ENDPOINT = `https://zapier.com/developer/public-invite/${ZAPIER_PATH}/`;

// props
// action_data, open, headers_loading, sheet_headers, toggleSection, variables, showNextSection
const SetupSection = (props) => {
  const { integrationsUser, toggleSection, open, apiKey, showNextSection, headers_loading } = props;
  const feed = integrationsUser && integrationsUser.user_id;
  return (
    <>
      <div className="d-flex flex-column section-title-container" onClick={() => toggleSection()}>
        <div className="integrations-section-title text-muted">Zapier Setup</div>
      </div>
      <Collapse isOpen={open} className="w-100">
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
        {!headers_loading && (
          <div className="text-center my-3">
            <Button isFlat onClick={showNextSection}>
              Next
            </Button>
          </div>
        )}
      </Collapse>
    </>
  );
};

export default SetupSection;
