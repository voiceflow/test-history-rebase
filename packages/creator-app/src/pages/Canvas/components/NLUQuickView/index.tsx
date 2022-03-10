import { Box, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { InteractionModelTabType, ModalType } from '@/constants';
import { useModals } from '@/hooks';

import Sidebar from './components/Sidebar';

const NLUQuickView: React.FC = () => {
  const { data }: { data: { initialSelectedID?: string } } = useModals(ModalType.NLU_MODEL_QUICK_VIEW);

  const [activeTab, setActiveTab] = React.useState(InteractionModelTabType.INTENTS);
  const [selectedID, setSelectedID] = React.useState('');

  useDidUpdateEffect(() => {
    if (data.initialSelectedID) {
      setSelectedID(data.initialSelectedID);
    }
  }, [data.initialSelectedID]);

  return (
    <Modal
      leftSidebar={() => <Sidebar selectedID={selectedID} activeTab={activeTab} setActiveTab={setActiveTab} setSelectedItemID={setSelectedID} />}
      maxWidth={740}
      id={ModalType.NLU_MODEL_QUICK_VIEW}
      title="Test"
      headerBorder
    >
      <Box width="100%" overflow="auto" height="calc(100vh - 120px)"></Box>
    </Modal>
  );
};

export default NLUQuickView;
