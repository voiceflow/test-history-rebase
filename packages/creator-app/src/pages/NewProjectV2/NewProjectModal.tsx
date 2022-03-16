import { ModalBodyContainer } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';
import { ClassName } from '@/styles/constants';

import NewProject from '.';

const NewProjectModal: React.FC = () => {
  return (
    <Modal id={ModalType.PROJECT_CREATE_MODAL} className={`${ClassName.MODAL}--payment`} maxWidth={545} withHeader title="Create Assistant">
      <ModalBodyContainer fullWidth>
        <NewProject />
      </ModalBodyContainer>
    </Modal>
  );
};

export default NewProjectModal;
