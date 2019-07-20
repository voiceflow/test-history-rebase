import './Modals.css';

import React from 'react';
import { Input } from 'reactstrap';

import { Spinner } from '@/components/Spinner';
import Button from '@/componentsV2/Button';
import { GOOGLE_OAUTH_ID } from '@/config';

// eslint-disable-next-line no-secrets/no-secrets
const OAUTH_URL = `https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=${GOOGLE_OAUTH_ID}&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Factions.builder%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&state=state`;

const MultiPlatformModalContent = ({ token, onChange, loading, onVerify }) => {
  return (
    <div className="d-flex flex-column">
      <div className="w-100">
        <div className="mb-4">
          <div className="my-2">Step 1</div>
          <div className="text-muted my-3" style={{ fontSize: '0.9rem' }}>
            Give Voiceflow access to manage Google Assistant projects by pasting your authentication token.
          </div>
          <a href={OAUTH_URL} target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="secondary" className="btn btn-clear">
              Log In
            </Button>
          </a>
        </div>
        <hr />
        <div className="my-4">
          <div className="my-2">Step 2</div>
          <div className="text-muted mb-2 mt-3" style={{ fontSize: '0.9rem' }}>
            Copy and paste the authentication code given in the field below.
          </div>
          <Input
            className="form-bg"
            type="text"
            name="google_token"
            placeholder="Paste your Google Authentication Token here"
            value={token}
            onChange={onChange}
            disabled={loading}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center pt-1 mb-4 w-100">
        {!loading && (
          <Button className="mr-4" onClick={onVerify}>
            Verify
          </Button>
        )}
        {loading && <Spinner isEmpty />}
      </div>
    </div>
  );
};

export default MultiPlatformModalContent;
