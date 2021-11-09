import { Nullable } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import { Alert, AlertVariant, Box, Button, ButtonVariant, Link, LoadCircle } from '@voiceflow/ui';
import React from 'react';

import { linkGraphic } from '@/assets';
import AmazonLoginButton from '@/components/Forms/AmazonLogin';
import GoogleLoginButton from '@/components/Forms/GoogleLogin';
import Modal, { ModalFooter } from '@/components/Modal';
import { FeatureFlag } from '@/config/features';
import { GOOGLE_OAUTH_SCOPES, GOOGLE_OAUTH_SCOPES_V2, ModalType } from '@/constants';
import { AlexaStageType, DialogflowStageType, GoogleStageType } from '@/constants/platforms';
import { useFeature, useModals } from '@/hooks';
import { Account } from '@/models';
import * as Models from '@/models';
import { ActionContainer, BodyContainer, BoldText, ButtonContainer, ContentContainer } from '@/pages/Dashboard/components/ModalComponents';
import { getPlatformValue } from '@/utils/platform';

export interface PlatformBaseModalProps {
  modalType: ModalType;
  className?: string;
  helpLink?: string;
  state: {
    error: boolean;
    loading: boolean;
  };
  platform?: Constants.PlatformType;
  api: any;
  title?: string;
  platformName?: string;
  projectName?: string;
}

export const PlatformBaseModal: React.FC<PlatformBaseModalProps> = ({
  modalType,
  className,
  helpLink,
  state,
  api,
  title,
  platform,
  platformName,
  projectName,
}) => {
  const { close: closeConnectModal, data } = useModals<{
    stage: GoogleStageType | DialogflowStageType | AlexaStageType;
    onCancel: VoidFunction;
    updateCurrentStage: (data: unknown) => void;
  }>(modalType);
  const { updateCurrentStage } = data;

  const isGoogleCreate = useFeature(FeatureFlag.GOOGLE_CREATE)?.isEnabled;
  const isDialogFlow = useFeature(FeatureFlag.DIALOGFLOW)?.isEnabled;

  const onLoad = () => {
    api.update({ error: false, loading: true });
  };

  const onFail = () => {
    api.update({ error: true, loading: false });
  };

  const onSuccess = (account: Nullable<Account> | Models.Account.Google) => {
    api.update({ error: false, loading: false });

    updateCurrentStage(account);
  };

  const onCancel = () => {
    closeConnectModal();
    data.onCancel();
  };

  return (
    <Modal id={modalType} maxWidth={392} className={className} title={title}>
      <Box width="100%">
        <BodyContainer column>
          {state.loading ? (
            <>
              <LoadCircle />
              <ContentContainer>
                Waiting for a verified connection to your <BoldText>{platformName} Developer</BoldText> account.
              </ContentContainer>
            </>
          ) : (
            <>
              <img src={linkGraphic} alt="plan restriction" height={80} />

              <ContentContainer>
                Please connect your <BoldText>{platformName} Developer</BoldText> account to upload your {projectName}.
              </ContentContainer>
            </>
          )}
          {state.error && (
            <Alert variant={AlertVariant.DANGER} mb={0} mt={8}>
              Login With {platformName} Failed
            </Alert>
          )}
        </BodyContainer>

        <ModalFooter justifyContent="space-between">
          <div>{helpLink && <Link href={helpLink}>See more</Link>}</div>

          <ActionContainer>
            <Button variant={ButtonVariant.TERTIARY} onClick={onCancel}>
              Cancel
            </Button>

            {platform && (
              <ButtonContainer>
                {getPlatformValue(
                  platform,
                  {
                    [Constants.PlatformType.ALEXA]: (
                      <AmazonLoginButton disabled={state.loading} onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />
                    ),
                  },
                  <GoogleLoginButton
                    scopes={isGoogleCreate || isDialogFlow ? GOOGLE_OAUTH_SCOPES_V2 : GOOGLE_OAUTH_SCOPES}
                    onLoad={onLoad}
                    onFail={onFail}
                    onSuccess={onSuccess}
                  />
                )}
              </ButtonContainer>
            )}
          </ActionContainer>
        </ModalFooter>
      </Box>
    </Modal>
  );
};
