import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Input } from 'reactstrap';

import { Spinner } from '@/components/Spinner';
import Button from '@/componentsV2/Button';
import { GOOGLE_OAUTH_ID } from '@/config';
import { createGoogleSession } from '@/ducks/account';

// eslint-disable-next-line no-secrets/no-secrets
const OAUTH_URL = `https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=${GOOGLE_OAUTH_ID}&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Factions.builder%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&state=state`;

export const GoogleLoginForm = (props) => {
  const { onLoad, onFail, onSuccess, createGoogleSession, ButtonWrapper } = props;
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    onLoad();
    setLoading(true);
    try {
      await createGoogleSession(token);
      onSuccess();
      setLoading(false);
    } catch (err) {
      onFail();
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column">
      <div className="w-100 pb-3">
        <div className="mb-4">
          <div className="my-2 text-muted">1. Connect Google</div>
          <div className="my-3" style={{ fontSize: '0.9rem' }}>
            Give Voiceflow access to manage Google Assistant projects by pasting your authentication token.
          </div>
          <a href={OAUTH_URL} target="_blank" rel="noopener noreferrer" className="no-underline">
            <Button type="button" variant="secondary">
              Login with Google
            </Button>
          </a>
        </div>
        <hr />
        <div className="my-4">
          <div className="my-2 text-muted">2. Paste Credentials</div>
          <div className="my-3" style={{ fontSize: '0.9rem' }}>
            Copy and paste the authentication code given in the field below.
          </div>
          <Input
            className="form-bg"
            type="text"
            name="google_token"
            placeholder="Paste your Google Authentication Token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      <ButtonWrapper>
        {!loading && (
          <Button onClick={onVerify} disabled={!token.length}>
            Verify
          </Button>
        )}
        {loading && <Spinner isEmpty />}
      </ButtonWrapper>
    </div>
  );
};

GoogleLoginForm.propTypes = {
  onSuccess: PropTypes.func,
  onFail: PropTypes.func,
  onLoad: PropTypes.func,
};

export default connect(
  null,
  { createGoogleSession }
)(GoogleLoginForm);
