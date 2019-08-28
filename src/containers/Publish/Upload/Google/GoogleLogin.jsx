import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

import GoogleLoginButton from '@/components/Forms/GoogleLogin';
import { GoogleLogin } from '@/ducks/publish/google';

import { IndefiniteLoading } from '../common/Loading';
import { PopupButtonSection, UploadPromptWrapper } from '../styled';

const GetGoogleLogin = (props) => {
  const { GoogleLogin } = props;

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fail = () => {
    setLoading(false);
    setError(true);
  };

  const success = () => {
    GoogleLogin();
  };

  if (loading) return <IndefiniteLoading message="Verifying Login" />;

  return (
    <UploadPromptWrapper>
      {error && (
        <Alert color="danger">
          <span className="fail-icon" /> Google Login Failed - Try Again
        </Alert>
      )}
      <GoogleLoginButton onLoad={() => setLoading(true)} onFail={fail} onSuccess={success} ButtonWrapper={PopupButtonSection} />
    </UploadPromptWrapper>
  );
};

export default connect(
  null,
  { GoogleLogin }
)(GetGoogleLogin);
