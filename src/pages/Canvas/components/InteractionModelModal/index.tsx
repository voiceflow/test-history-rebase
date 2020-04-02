import React from 'react';

import Tabs from '@/components/Tabs';
import { ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';

import { IntentsManager, Modal, SlotsManager, VariablesManager } from './components';
import { TABS, TabType } from './constants';

function InteractionModelModal() {
  const [modalRef, setModalRef] = React.useState<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>(TabType.INTENTS);

  return (
    <Modal
      id={ModalType.INTERACTION_MODEL}
      ref={setModalRef}
      title={<Tabs selected={activeTab} options={TABS} onChange={setActiveTab} />}
      isSmall={false}
    >
      {!!modalRef && (
        <TextEditorVariablesPopoverProvider value={modalRef}>
          {activeTab === TabType.SLOTS && <SlotsManager />}
          {activeTab === TabType.INTENTS && <IntentsManager />}
          {activeTab === TabType.VARIABLES && <VariablesManager />}
        </TextEditorVariablesPopoverProvider>
      )}
    </Modal>
  );
}

export default InteractionModelModal;
