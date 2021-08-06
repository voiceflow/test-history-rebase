import { PlatformType } from '@voiceflow/internal';
import { Alert, AlertVariant, Box, Button, ButtonVariant, Link, LoadCircle, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import { linkGraphic } from '@/assets';
import AmazonLoginButton from '@/components/Forms/AmazonLogin';
import GoogleLoginButton from '@/components/Forms/GoogleLogin';
import { ModalFooter } from '@/components/Modal';
import { GOOGLE_OAUTH_SCOPES, ModalType } from '@/constants';
import { AlexaStageType, GoogleStageType } from '@/constants/platforms';
import * as Project from '@/ducks/project';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { Account } from '@/models';
import * as Models from '@/models';
import {
  ActionContainer,
  BodyContainer,
  BoldText,
  ButtonContainer,
  ConnectStyledModal,
  ContentContainer,
} from '@/pages/Dashboard/components/ModalComponents';
import { ConnectedProps, Nullable } from '@/types';

export interface ConnectBaseModalProps {
  modalType: ModalType;
  className?: string;
  helpLink?: string;
}

const ConnectBaseModal: React.FC<ConnectBaseModalProps & ConnectedConnectBaseModalProps> = ({ modalType, platform, helpLink, className }) => {
  const { close: closeConnectModal, data, isOpened } = useModals(modalType as ModalType);
  const { stage, updateCurrentStage } = data as any;
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

  const onSuccess = (account: Nullable<Account> | Models.Account.Google) => {
    api.update({
      error: false,
      loading: false,
    });

    updateCurrentStage(account);
  };

  const reset = () => {
    api.update({
      error: false,
      loading: false,
    });
  };

  // this handles the edge case where modal is closed without authentication is completed
  React.useEffect(() => {
    if (!isOpened) {
      reset();
    }
  }, [isOpened]);

  if (stage === AlexaStageType.IDLE || stage === GoogleStageType.IDLE) {
    return (
      <ConnectStyledModal id={modalType} className={className} title={`connect to ${platform === PlatformType.ALEXA ? 'amazon' : 'google'}`} isSmall>
        <Box width="100%">
          <BodyContainer column>
            <LoadCircle />
          </BodyContainer>
        </Box>
      </ConnectStyledModal>
    );
  }

  switch (platform) {
    case PlatformType.ALEXA:
      return (
        <ConnectStyledModal id={modalType} className={className} title="connect to amazon" isSmall>
          <Box width="100%">
            <BodyContainer column>
              {state.loading ? (
                <>
                  <LoadCircle />
                  <ContentContainer>
                    Waiting for a verfied connection to your <BoldText>Amazon Developer</BoldText> account.
                  </ContentContainer>
                </>
              ) : (
                <>
                  <img src={linkGraphic} alt="plan restriction" height={80} />

                  <ContentContainer>
                    Please connect your <BoldText>Amazon Developer</BoldText> account to upload your skill to Alexa.
                  </ContentContainer>
                </>
              )}
              {state.error && (
                <Alert variant={AlertVariant.DANGER} mb={0} mt={8}>
                  Login With Amazon Failed
                </Alert>
              )}
            </BodyContainer>

            <ModalFooter justifyContent="space-between">
              <div>{helpLink && <Link href={helpLink}>See more</Link>}</div>

              <ActionContainer>
                <Button variant={ButtonVariant.TERTIARY} onClick={closeConnectModal}>
                  Cancel
                </Button>
                <ButtonContainer>
                  <AmazonLoginButton disabled={state.loading} onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />
                </ButtonContainer>
              </ActionContainer>
            </ModalFooter>
          </Box>
        </ConnectStyledModal>
      );
    case PlatformType.GOOGLE:
      return (
        <ConnectStyledModal id={modalType} className={className} title="connect to google" isSmall>
          <Box width="100%">
            <BodyContainer column>
              {state.loading ? (
                <>
                  <LoadCircle />
                  <ContentContainer>
                    Waiting for a verfied connection to your <BoldText>Google Developer</BoldText> account.
                  </ContentContainer>
                </>
              ) : (
                <>
                  <img src={linkGraphic} alt="plan restriction" height={80} />

                  <ContentContainer>
                    Please connect your <BoldText>Google Developer</BoldText> account to upload your Action.
                  </ContentContainer>
                </>
              )}
              {state.error && (
                <Alert variant={AlertVariant.DANGER} mb={0} mt={8}>
                  Login With Google Failed
                </Alert>
              )}
            </BodyContainer>

            <ModalFooter justifyContent="space-between">
              <div>{helpLink && <Link href={helpLink}>See more</Link>}</div>

              <ActionContainer>
                <Button variant={ButtonVariant.TERTIARY} onClick={closeConnectModal}>
                  Cancel
                </Button>
                <ButtonContainer>
                  <GoogleLoginButton scopes={GOOGLE_OAUTH_SCOPES} onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />
                </ButtonContainer>
              </ActionContainer>
            </ModalFooter>
          </Box>
        </ConnectStyledModal>
      );
    default:
      return null;
  }
};

const mapStateToProps = {
  platform: Project.activePlatformSelector,
};

type ConnectedConnectBaseModalProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ConnectBaseModal) as React.FC<ConnectBaseModalProps>;
