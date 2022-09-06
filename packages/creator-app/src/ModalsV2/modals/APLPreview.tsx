import { Modal } from '@voiceflow/ui';
import React from 'react';

import DisplayRenderer from '@/components/DisplayRenderer';

import manager from '../manager';

interface Props {
  apl?: string;
  displayData?: string;
  commands?: string;
}

const APLPreview = manager.create<Props>('APLPreview', () => ({ api, type, opened, hidden, animated, apl, displayData, commands }) => (
  <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
    <Modal.Header>Display Preview</Modal.Header>
    <Modal.Body>
      <DisplayRenderer apl={apl} data={displayData} commands={commands} withControls />
    </Modal.Body>
  </Modal>
));

export default APLPreview;
