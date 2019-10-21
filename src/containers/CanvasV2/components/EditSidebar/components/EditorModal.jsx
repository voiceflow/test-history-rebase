import React from 'react';

import Modal from '@/components/Modal';

import EditorModalBody from './EditorModalBody';
import EditorModalHeader from './EditorModalHeader';

const EditorModal = ({ disableModalMode, isModal, editor, data }) => (
  <Modal toggle={disableModalMode} isOpen={isModal} onClosed={disableModalMode} size="lg">
    <EditorModalHeader style={{ paddingBottom: '0' }} toggle={disableModalMode} header={`${data.name} Settings`} />
    <EditorModalBody>{editor}</EditorModalBody>
  </Modal>
);

export default EditorModal;
