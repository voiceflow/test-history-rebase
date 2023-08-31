import { Modal } from '@voiceflow/ui';
import React from 'react';

import * as Creator from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';

interface EditorModalProps extends React.PropsWithChildren {
  onClose: VoidFunction;
}

const EditorModal: React.FC<EditorModalProps> = ({ onClose, children }) => {
  const data = useSelector(Creator.focusedNodeDataSelector);

  return (
    <>
      <Modal.Backdrop onClick={() => onClose()} closing={false} />

      <Modal opened maxWidth={800} hidden={false}>
        <Modal.Header>{data?.name} Settings</Modal.Header>
        <Modal.Body padding="0 11px !important">{children}</Modal.Body>
      </Modal>
    </>
  );
};

export default EditorModal;
