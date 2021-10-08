import { Constants } from '@voiceflow/general-types';
import { Box, LoadCircle, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import { AlexaStageType, DialogflowStageType, GoogleStageType } from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { BodyContainer, ConnectStyledModal } from '@/pages/Dashboard/components/ModalComponents';
import { ConnectedProps } from '@/types';
import { createPlatformSelector } from '@/utils/platform';

import { PlatformBaseModal, PlatformBaseModalProps } from './PlatformBaseModal';

export interface ConnectBaseModalProps {
  modalType: ModalType;
  className?: string;
  helpLink?: string;
}

const ConnectBaseModal: React.FC<ConnectBaseModalProps & ConnectedConnectBaseModalProps> = ({ modalType, platform, helpLink, className }) => {
  const { data, isOpened } = useModals<{
    stage: AlexaStageType | GoogleStageType | DialogflowStageType;
    onCancel: VoidFunction;
    updateCurrentStage: (data: unknown) => void;
  }>(modalType);
  const { stage } = data;

  const [state, api] = useSmartReducerV2({ error: false, loading: false });

  const reset = () => {
    api.update({ error: false, loading: false });
  };

  const getPlatformBaseModalProps = createPlatformSelector<PlatformBaseModalProps>(
    {
      [Constants.PlatformType.ALEXA]: {
        api,
        state,
        modalType,
        className,
        helpLink,
        platform,
        title: 'connect to amazon',
        platformName: 'Amazon',
        projectName: 'skill to Alexa',
      },
      [Constants.PlatformType.GOOGLE]: {
        api,
        state,
        modalType,
        className,
        helpLink,
        platform,
        title: 'connect to google',
        platformName: 'Google',
        projectName: 'Action',
      },
      [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: {
        api,
        state,
        modalType,
        className,
        helpLink,
        platform,
        title: 'connect to dialogflow',
        platformName: 'Dialogflow Chat',
        projectName: 'Dialogflow project',
      },
      [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: {
        api,
        state,
        modalType,
        className,
        helpLink,
        platform,
        title: 'connect to dialogflow',
        platformName: 'Dialogflow Voice',
        projectName: 'Dialogflow project',
      },
    },
    {
      api,
      state,
      modalType,
    }
  );

  // this handles the edge case where modal is closed without authentication is completed
  React.useEffect(() => {
    if (!isOpened) {
      reset();
    }
  }, [isOpened]);

  if (stage === AlexaStageType.IDLE || stage === GoogleStageType.IDLE) {
    return (
      <ConnectStyledModal
        id={modalType}
        title={`connect to ${platform === Constants.PlatformType.ALEXA ? 'amazon' : 'google'}`}
        isSmall
        className={className}
      >
        <Box width="100%">
          <BodyContainer column>
            <LoadCircle />
          </BodyContainer>
        </Box>
      </ConnectStyledModal>
    );
  }
  if (stage === DialogflowStageType.IDLE) {
    return (
      <ConnectStyledModal id={modalType} title="connect to dialogflow" isSmall className={className}>
        <Box width="100%">
          <BodyContainer column>
            <LoadCircle />
          </BodyContainer>
        </Box>
      </ConnectStyledModal>
    );
  }

  return <PlatformBaseModal {...getPlatformBaseModalProps(platform)} />;
};

const mapStateToProps = {
  platform: ProjectV2.active.platformSelector,
};

type ConnectedConnectBaseModalProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ConnectBaseModal) as React.FC<ConnectBaseModalProps>;
