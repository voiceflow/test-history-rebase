import React from 'react';

import AlertMessage, { AlertMessageVariant } from '@/components/AlertMessage';
import Box from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import AmazonLoginButton from '@/components/Forms/AmazonLogin';
import GoogleLoginButton from '@/components/Forms/GoogleLogin';
import { LoadCircle } from '@/components/Loader';
import { ModalFooter } from '@/components/Modal';
import { Link } from '@/components/Text';
import { GOOGLE_OAUTH_SCOPES, ModalType, PlatformType } from '@/constants';
import { AlexaStageType, GoogleStageType } from '@/constants/platforms';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useModals, useSmartReducerV2 } from '@/hooks';
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

export type ConnectBaseModalProps = {
  modalType: ModalType;
  platform: PlatformType;
  className?: string;
  helpLink?: string;
};

const ConnectBaseModal: React.FC<ConnectBaseModalProps & ConnectedConnectBaseModalProps> = ({ modalType, platform, helpLink, className }) => {
  const { close: closeConnectModal, data } = useModals(modalType as ModalType);
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
                  <img src="/testable-link.svg" alt="plan restriction" height={80} />

                  <ContentContainer>
                    Please connect your <BoldText>Amazon Developer</BoldText> account to upload your skill to Alexa.
                  </ContentContainer>
                </>
              )}
              {state.error && (
                <AlertMessage variant={AlertMessageVariant.DANGER} mb={0} mt={4}>
                  Login With Amazon Failed
                </AlertMessage>
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
                  <img src="/testable-link.svg" alt="plan restriction" height={80} />

                  <ContentContainer>
                    Please connect your <BoldText>Google Developer</BoldText> account to upload your Action.
                  </ContentContainer>
                </>
              )}
              {state.error && (
                <AlertMessage variant={AlertMessageVariant.DANGER} mb={0} mt={4}>
                  Login With Google Failed
                </AlertMessage>
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
  platform: Skill.activePlatformSelector,
};

type ConnectedConnectBaseModalProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ConnectBaseModal) as React.FC<ConnectBaseModalProps>;
