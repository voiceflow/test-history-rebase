import { PrimaryButton } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import TableToolbar from '@/pages/NLUManager/components/TableToolbar';
import { useNLUManager } from '@/pages/NLUManager/context';

const IntentTableToolbar: React.FC = () => {
  const nluManager = useNLUManager();
  const { open: openExportModelModal } = useModals<{ checkedItems: string[] }>(ModalType.EXPORT_MODEL);

  const exportIntents = () => {
    openExportModelModal({ checkedItems: Array.from(nluManager.selectedIntentIDs) });
  };

  const resetSelectedIntents = () => {
    nluManager.setSelectedIntentIDs([]);
  };

  const deleteIntents = async () => {
    await nluManager.deleteIntents();
    resetSelectedIntents();
  };

  return (
    <TableToolbar width={450} isOpen={nluManager.selectedIntentIDs.size >= 2}>
      <TableToolbar.LeftActions>
        <TableToolbar.SelectCheckbox onClick={resetSelectedIntents} />
        <TableToolbar.TextBox>{nluManager.selectedIntentIDs.size} intents selected</TableToolbar.TextBox>
      </TableToolbar.LeftActions>

      <TableToolbar.Actions>
        <TableToolbar.Icon icon="trash" onClick={deleteIntents} />
        <PrimaryButton onClick={exportIntents} squareRadius>
          Export
        </PrimaryButton>
      </TableToolbar.Actions>
    </TableToolbar>
  );
};

export default IntentTableToolbar;
