import { Spinner } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalBody } from '@/components/Modal';
import { ModalType } from '@/constants';

const LoadingModal: React.FC = () => (
  <Modal id={ModalType.LOADING} maxWidth={350} centered withHeader={false}>
    <ModalBody padding="24px !important" textAlign="center">
      <Spinner message="Loading" />
    </ModalBody>
  </Modal>
);

export default LoadingModal;
