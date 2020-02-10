import React from 'react';

import Modal from '@/components/Modal';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';

import EditorModalBody from './EditorModalBody';
import EditorModalHeader from './EditorModalHeader';

const EditorModal = ({ disableModalMode, editor, data }) => (
  <Modal toggle={disableModalMode} isOpen onClosed={disableModalMode} size="lg">
    <EditorModalHeader style={{ paddingBottom: '0' }} toggle={disableModalMode} header={`${data.name} Settings`} />
    <EditorModalBody>{editor}</EditorModalBody>
  </Modal>
);

const mapStateToProps = {
  data: Creator.focusedNodeDataSelector,
};

export default connect(mapStateToProps)(EditorModal);
