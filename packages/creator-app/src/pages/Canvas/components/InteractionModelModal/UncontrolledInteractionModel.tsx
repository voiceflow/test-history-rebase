import { IconVariant, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Tabs from '@/components/Tabs';
import { InteractionModelTabType, ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import { IntentsManager, Modal, ModalContent, SlotsManager, VariablesManager } from '@/pages/Canvas/components/InteractionModelModal/components';
import { TABS } from '@/pages/Canvas/components/InteractionModelModal/constants';

interface UncontrolledInteractionModelProps {
  activeTab: any;
  onChangeTab: any;
  openExportModal: any;
  setModalRef: any;
  modalRef: any;
  selectedID: any;
  onSetSelectedID: any;
  onSetSelectedTypeAndID: any;
  newUtterance?: string;
}

const UncontrolledInteractionModel: React.FC<UncontrolledInteractionModelProps> = ({
  activeTab,
  onChangeTab,
  openExportModal,
  setModalRef,
  modalRef,
  onSetSelectedID,
  selectedID,
  onSetSelectedTypeAndID,
}) => {
  return (
    <Modal
      id={ModalType.INTERACTION_MODEL}
      ref={setModalRef}
      title={<Tabs selected={activeTab} options={TABS} onChange={onChangeTab} />}
      icon={<SvgIcon icon="exportModel" variant={IconVariant.STANDARD} clickable size={16} onClick={openExportModal} />}
      isSmall={false}
    >
      {!!modalRef && (
        <TextEditorVariablesPopoverProvider value={modalRef}>
          <ModalContent>
            {activeTab === InteractionModelTabType.SLOTS && <SlotsManager selectedID={selectedID} setSelectedID={onSetSelectedID} />}
            {activeTab === InteractionModelTabType.INTENTS && <IntentsManager selectedID={selectedID} setSelectedID={onSetSelectedID} />}
            {activeTab === InteractionModelTabType.VARIABLES && (
              <VariablesManager selectedID={selectedID} setSelectedID={onSetSelectedID} setSelectedTypeAndID={onSetSelectedTypeAndID} />
            )}
          </ModalContent>
        </TextEditorVariablesPopoverProvider>
      )}
    </Modal>
  );
};

export default UncontrolledInteractionModel;
