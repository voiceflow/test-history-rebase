import React from 'react';

import Modal from '@/components/LegacyModal';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { NodeData } from '@/models';

import EditorModalBody from './EditorModalBody';
import EditorModalHeader from './EditorModalHeader';

const ModalComponent: React.FC<any> = Modal;

export type EditorModalProps = {
  disableModalMode?: () => void;
  data: NodeData<any>;
  editor: React.ReactNode;
};

const EditorModal: React.FC<EditorModalProps> = ({ disableModalMode, editor, data }) => (
  <ModalComponent toggle={disableModalMode} isOpen onClosed={disableModalMode} size="lg">
    <EditorModalHeader style={{ paddingBottom: '0' }} toggle={disableModalMode} header={`${data.name} Settings`} />
    <EditorModalBody>{editor}</EditorModalBody>
  </ModalComponent>
);

const mapStateToProps = {
  data: Creator.focusedNodeDataSelector,
};

export type ConnectedEditorModalProps = Omit<EditorModalProps, keyof typeof mapStateToProps>;

export default connect(mapStateToProps)(EditorModal) as React.FC<ConnectedEditorModalProps>;
