import { Box, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { InteractionModelTabType, ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { SlotsManager, VariablesManager } from '@/pages/Canvas/components/InteractionModelModal/components';
import { Manager } from '@/pages/Canvas/components/InteractionModelModal/components/IntentsManager/components';

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

  const onSetSelectedTypeAndID = React.useCallback((type: InteractionModelTabType, id: string) => {
    setActiveTab(type);
    setSelectedID(id);
  }, []);

  return (
    <Modal
      leftSidebar={() => <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
      maxWidth={740}
      id={ModalType.NLU_MODEL_QUICK_VIEW}
      title="Test"
      headerBorder
    >
      <Box width="100%" overflow="auto" height="calc(100vh - 220px)">
        {activeTab === InteractionModelTabType.SLOTS && <SlotsManager selectedID={selectedID} setSelectedID={setSelectedID} />}
        {activeTab === InteractionModelTabType.INTENTS && <Manager id={selectedID} removeIntent={() => {}} />}
        {activeTab === InteractionModelTabType.VARIABLES && (
          <VariablesManager selectedID={selectedID} setSelectedID={setSelectedID} setSelectedTypeAndID={onSetSelectedTypeAndID} />
        )}
      </Box>
    </Modal>
  );
};

export default NLUQuickView;
