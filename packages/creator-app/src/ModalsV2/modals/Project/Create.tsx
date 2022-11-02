import { FlexCenter, Modal, Spinner } from '@voiceflow/ui';
import React from 'react';

import NewProjectPage from '@/pages/NewProjectV2';
import { ClassName } from '@/styles/constants';

import manager from '../../manager';

const Create = manager.create<{ listID?: string }>('CreateProject', () => ({ api, type, opened, hidden, animated, listID }) => {
  const [isCreatingProject, setIsCreatingProject] = React.useState(false);

  return (
    <Modal
      type={type}
      opened={opened}
      hidden={hidden}
      animated={animated && !isCreatingProject}
      onExited={api.remove}
      maxWidth={450}
      className={`${ClassName.MODAL}--payment`}
      fullScreen={isCreatingProject}
    >
      {!isCreatingProject && <Modal.Header border>Create Assistant</Modal.Header>}

      {isCreatingProject ? (
        <FlexCenter fullHeight>
          <Spinner message="Creating Project..." />
        </FlexCenter>
      ) : (
        <NewProjectPage listID={listID} onClose={api.close} onToggleCreating={setIsCreatingProject} />
      )}
    </Modal>
  );
});

export default Create;
