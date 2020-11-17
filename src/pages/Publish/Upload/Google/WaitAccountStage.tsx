import React from 'react';

import AlertMessage, { AlertMessageVariant } from '@/components/AlertMessage';
import GoogleLoginButton from '@/components/Forms/GoogleLogin';
import { GOOGLE_OAUTH_SCOPES } from '@/constants';
import { useSmartReducerV2 } from '@/hooks';
import { Account } from '@/models';

import { ButtonContainer, Description, LoaderStage, StageContainer } from '../components';

type WaitAccountStageProps = {
  updateCurrentStage: (data: unknown) => void;
};

const WaitAccountStage: React.FC<WaitAccountStageProps> = ({ updateCurrentStage }) => {
  const [state, api] = useSmartReducerV2({
    error: false,
    loading: false,
  });

  const onLoad = () => {
    api.update({
      error: false,
      loading: true,
    });
  };

  const onFail = () => {
    api.update({
      error: true,
      loading: false,
    });
  };

  const onSuccess = (account: Account.Google) => {
    api.update({
      error: false,
      loading: false,
    });

    updateCurrentStage(account);
  };

  return state.loading ? (
    <LoaderStage>Verifying Login</LoaderStage>
  ) : (
    <StageContainer>
      <img src="/Connect-account.svg" alt="" />

      {state.error && (
        <AlertMessage variant={AlertMessageVariant.DANGER} mb={0} mt={4}>
          Login With Google Failed
        </AlertMessage>
      )}

      <Description>Please connect your Google developer account to upload your action.</Description>

      <ButtonContainer>
        <GoogleLoginButton scopes={GOOGLE_OAUTH_SCOPES} onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />
      </ButtonContainer>
    </StageContainer>
  );
};

export default WaitAccountStage;
