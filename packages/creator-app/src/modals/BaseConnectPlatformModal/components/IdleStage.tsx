import { Box, LoadCircle, ModalBodyContainer } from '@ui';
import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';

export interface IdleStageProps {
  modalType: ModalType;
  title: string;
  className?: string;
}

const IdleStage: React.FC<IdleStageProps> = ({ modalType, title, className }) => (
  <Modal id={modalType} title={title} maxWidth={392} className={className}>
    <Box width="100%">
      <ModalBodyContainer column>
        <LoadCircle />
      </ModalBodyContainer>
    </Box>
  </Modal>
);

export default IdleStage;

export const AlexaIdleStage: React.FC<Omit<IdleStageProps, 'title'>> = (props) => <IdleStage {...props} title="connect to amazon" />;
export const GoogleIdleStage: React.FC<Omit<IdleStageProps, 'title'>> = (props) => <IdleStage {...props} title="connect to google" />;
export const DialogflowIdleStage: React.FC<Omit<IdleStageProps, 'title'>> = (props) => <IdleStage {...props} title="connect to dialogflow" />;
