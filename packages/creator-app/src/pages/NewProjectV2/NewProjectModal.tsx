import { FlexCenter, Spinner } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { ModalType } from '@/constants';
import { ClassName } from '@/styles/constants';

import NewProject from '.';

const NewProjectModal: React.FC = () => {
  const [isCreatingProject, setIsCreatingProject] = React.useState<boolean>(false);
  return (
    <Modal
      id={ModalType.PROJECT_CREATE_MODAL}
      className={`${ClassName.MODAL}--payment`}
      maxWidth={450}
      withHeader={!isCreatingProject}
      fullScreen={isCreatingProject}
      headerBorder
      title="Create Assistant"
    >
      {isCreatingProject ? (
        <FlexCenter fullHeight>
          <Spinner message="Creating Project..." />
        </FlexCenter>
      ) : (
        <NewProject onCreatingProject={setIsCreatingProject} />
      )}
    </Modal>
  );
};

export default NewProjectModal;
