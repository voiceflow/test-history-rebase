import { Nullable } from '@voiceflow/common';
import { Alert, Box, Button, ButtonVariant, LoadCircle } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { linkGraphic } from '@/assets';
import AmazonLoginButton from '@/components/Forms/AmazonLogin';
import GoogleLoginButton from '@/components/Forms/GoogleLogin';
import Modal, { ModalFooter } from '@/components/Modal';
import { GOOGLE_OAUTH_SCOPES, ModalType } from '@/constants';
import { SourceType } from '@/ducks/tracking/constants';
import { useModals, useTrackingEvents } from '@/hooks';
import { Account } from '@/models';
import * as Models from '@/models';
import { getPlatformValue } from '@/utils/platform';

import { PlatformModalProps } from './types';

export interface BaseConnectPlatformModalProps extends PlatformModalProps {
  modalType: ModalType;
  isLoading: boolean;
  hasError: boolean;
  platform?: VoiceflowConstants.PlatformType;
  onLoad: VoidFunction;
  onComplete: VoidFunction;
  onFail: VoidFunction;
  connectAccount?: (data: unknown) => void;
}

const BaseConnectPlatformModal: React.FC<BaseConnectPlatformModalProps> = ({
  modalType,
  isLoading,
  hasError,
  title,
  platform,
  platformName,
  projectName,
  onLoad,
  onComplete,
  onFail,
  connectAccount,
}) => {
  const { close: closeConnectModal, data } = useModals<{
    onCancel: VoidFunction;
    source: SourceType;
  }>(modalType);

  const [trackingEvents] = useTrackingEvents();

  const onSuccess = (account: Nullable<Account> | Models.Account.Google) => {
    onComplete();
    connectAccount?.(account);
    if (platform && data.source) {
      trackingEvents.trackDeveloperAccountConnected(platform, data.source);
    }
  };

  const onCancel = () => {
    closeConnectModal();
    data.onCancel();
  };

  return (
    <Modal id={modalType} maxWidth={392} title={title}>
      <Box width="100%">
        <Modal.Body centred>
          {isLoading ? (
            <>
              <LoadCircle />
              <Box mt={16}>
                Waiting for a verified connection to your <b>{platformName} Developer</b> account.
              </Box>
            </>
          ) : (
            <>
              <img src={linkGraphic} alt="plan restriction" height={80} />

              <Box mt={16}>
                Please connect your <b>{platformName} Developer</b> account to upload your {projectName}.
              </Box>
            </>
          )}
          {hasError && (
            <Alert variant={Alert.Variant.DANGER} mb={0} mt={8}>
              Login With {platformName} Failed
            </Alert>
          )}
        </Modal.Body>

        <ModalFooter justifyContent="space-between">
          <Box.Flex gap={12} style={{ whiteSpace: 'nowrap' }}>
            <Button variant={ButtonVariant.TERTIARY} onClick={onCancel}>
              Cancel
            </Button>

            {platform &&
              getPlatformValue(
                platform,
                {
                  [VoiceflowConstants.PlatformType.ALEXA]: (
                    <AmazonLoginButton disabled={isLoading} onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />
                  ),
                },
                <GoogleLoginButton scopes={GOOGLE_OAUTH_SCOPES} onLoad={onLoad} onFail={onFail} onSuccess={onSuccess} />
              )}
          </Box.Flex>
        </ModalFooter>
      </Box>
    </Modal>
  );
};

export default BaseConnectPlatformModal;
