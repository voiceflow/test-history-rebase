import { Box, withProvider } from '@voiceflow/ui';
import React from 'react';

import Modal from '@/components/Modal';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';
import EntityForm from '@/pages/Canvas/components/EntityModalsV2/components/EntityForm';
import IntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm';

import HeaderOptions from './components/HeaderOptions';
import Sidebar from './components/Sidebar';
import { NLUQuickViewContext, NLUQuickViewProvider } from './context';

const NLUQuickView: React.FC = () => {
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);
  const slotsMap = useSelector(SlotV2.slotMapSelector);

  const { title, activeTab, selectedID, setIsActiveItemRename } = React.useContext(NLUQuickViewContext);

  const showIntentForm = activeTab === InteractionModelTabType.INTENTS && intentsMap[selectedID];
  const showEntityForm = activeTab === InteractionModelTabType.SLOTS && slotsMap[selectedID];
  const showVariableForm = activeTab === InteractionModelTabType.VARIABLES;

  return (
    <Modal
      leftSidebar={() => <Sidebar />}
      maxWidth={740}
      id={ModalType.NLU_MODEL_QUICK_VIEW}
      title={title}
      headerBorder
      headerActions={<HeaderOptions setIsActiveItemRename={setIsActiveItemRename} activeTab={activeTab} selectedID={selectedID} />}
    >
      <Box width="100%" overflow="auto" height="calc(100vh - 120px)">
        {showIntentForm && <IntentForm intent={intentsMap[selectedID]} withNameSection={false} />}
        {showEntityForm && <EntityForm slotID={selectedID} withNameSection={false} />}
        {showVariableForm && (
          <Box p={32} fontSize={13} color="#62778c">
            The confidence interval (measured as a value from 0 to 100) for the most recently matched intent.
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default withProvider(NLUQuickViewProvider)(NLUQuickView);
