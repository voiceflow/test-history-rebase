import { IconVariant, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Tabs from '@/components/Tabs';
import { InteractionModelTabType, ModalType } from '@/constants';
import { TextEditorVariablesPopoverProvider } from '@/contexts';
import { IntentsManager, Modal, ModalContent, SlotsManager, VariablesManager } from '@/pages/Canvas/components/InteractionModelModal/components';
import { TABS } from '@/pages/Canvas/components/InteractionModelModal/constants';

interface UncontrolledInteractionModelProps {
  modalRef: HTMLDivElement | null;
  activeTab: InteractionModelTabType;
  selectedID?: string;
  setModalRef: (node: HTMLDivElement | null) => void;
  onChangeTab: (nextSelected: InteractionModelTabType) => void;
  openExportModal: VoidFunction;
  onSetSelectedID: (id: string) => void;
  onSetSelectedTypeAndID: (type: InteractionModelTabType, id: string) => void;
}

const UncontrolledInteractionModel: React.FC<UncontrolledInteractionModelProps> = ({
  modalRef,
  activeTab,
  selectedID,
  setModalRef,
  onChangeTab,
  onSetSelectedID,
  openExportModal,
  onSetSelectedTypeAndID,
}) => {
  return (
    <Modal
      id={ModalType.INTERACTION_MODEL}
      ref={setModalRef}
      title={<Tabs selected={activeTab} options={TABS} onChange={onChangeTab} />}
      maxWidth={780}
      headerActions={<SvgIcon icon="exportModel" variant={IconVariant.STANDARD} clickable size={16} onClick={openExportModal} />}
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
