import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

import GoogleLoginButton from '@/components/Forms/GoogleLogin';
import { GoogleLogin, updateGoogle } from '@/ducks/publish/google';

import { IndefiniteLoading } from '../common/Loading';
import { PopupButtonSection, UploadPromptWrapper } from '../styled';

const GetGoogleLogin = (props) => {
  const { GoogleLogin, updateGoogle } = props;

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fail = () => {
    setLoading(false);
    setError(true);
  };

  const success = () => {
    // do no trigger the check dialogflow token state (to stay on modal)
    updateGoogle({ options: { check: false } });
    GoogleLogin();
  };

  if (loading)
    return (
      <div className="mt-4 mb-5">
        <IndefiniteLoading message="Verifying Login" />
      </div>
    );

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

export default connect(null, { GoogleLogin, updateGoogle })(GetGoogleLogin);
