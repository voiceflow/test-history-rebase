import React from 'react';

import AlertMessage, { AlertMessageVariant } from '@/components/AlertMessage';
import AmazonLoginButton from '@/components/Forms/AmazonLogin';
import { useSmartReducerV2 } from '@/hooks';
import { Account } from '@/models';
import { Nullable } from '@/types';

import { ButtonContainer, Description, LoaderStage, StageContainer } from '../shared';

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

  const onSuccess = (account: Nullable<Account.Amazon>) => {
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
          Login With Amazon Failed
        </AlertMessage>
      )}

      <Description>Please connect your Amazon developer account to upload your skill to Alexa.</Description>

      <ButtonContainer>
        <AmazonLoginButton onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />
      </ButtonContainer>
    </StageContainer>
  );
};

export default WaitAccountStage;
