import React from 'react';

import Modal, { ModalBody } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { useSelector } from '@/hooks';

export interface EditorModalProps {
  editor: React.ReactNode;
}

const EditorModal: React.FC<EditorModalProps> = ({ editor }) => {
  const data = useSelector(Creator.focusedNodeDataSelector);

  return (
    <Modal id={ModalType.FULLSCREEN_EDITOR} title={`${data?.name} Settings`} maxWidth={800}>
      <ModalBody padding="0 11px !important">{editor}</ModalBody>
    </Modal>
  );
};

export default EditorModal;
