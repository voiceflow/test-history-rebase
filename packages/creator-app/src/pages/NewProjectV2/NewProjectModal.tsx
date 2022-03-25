import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';
import { ClassName } from '@/styles/constants';

import NewProject from '.';

const NewProjectModal: React.FC = () => {
  return (
    <Modal id={ModalType.PROJECT_CREATE_MODAL} className={`${ClassName.MODAL}--payment`} maxWidth={450} headerBorder title="Create Assistant">
      <NewProject />
    </Modal>
  );
};

export default NewProjectModal;
