import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

import AmazonLoginButton from '@/components/Forms/AmazonLogin';
import { AmazonLogin } from '@/ducks/publish/alexa';

import { IndefiniteLoading } from '../common/Loading';
import { PopUpText, PopupButtonSection, UploadPromptWrapper } from '../styled';

const GetAmazonLogin = (props) => {
  const { AmazonLogin } = props;

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fail = () => {
    setLoading(false);
    setError(true);
  };

  const success = () => {
    AmazonLogin();
  };

  if (loading) return <IndefiniteLoading message="Verifying Login" />;

  return (
    <UploadPromptWrapper>
      {error && (
        <Alert color="danger">
          <span className="fail-icon" /> Login With Amazon Failed - Try Again
        </Alert>
      )}
      <img src="/Connect-account.svg" alt="" />
      <PopUpText>Please connect your Amazon developer account to upload your skill to Alexa.</PopUpText>

      <PopupButtonSection>
        <AmazonLoginButton onLoad={() => setLoading(true)} onFail={fail} onSuccess={success} />
      </PopupButtonSection>
    </UploadPromptWrapper>
  );
};

export default connect(
  null,
  { AmazonLogin }
)(GetAmazonLogin);
