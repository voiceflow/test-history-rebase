import { PrimaryButton } from '@voiceflow/ui';
import React from 'react';

import * as ModalsV2 from '@/ModalsV2';
import { useConfirmModal } from '@/ModalsV2/hooks';
import TableToolbar from '@/pages/NLUManager/components/TableToolbar';
import { useNLUManager } from '@/pages/NLUManager/context';

const IntentTableToolbar: React.FC = () => {
  const nluManager = useNLUManager();

  const confirmModal = useConfirmModal();
  const nluExportModal = ModalsV2.useModal(ModalsV2.NLU.Export);

  const exportIntents = () => {
    nluExportModal.openVoid({ checkedItems: Array.from(nluManager.selectedIntentIDs) });
  };

  const resetSelectedIntents = () => {
    nluManager.setSelectedIntentIDs([]);
  };

  const deleteIntents = async () => {
    await nluManager.deleteIntents();
    resetSelectedIntents();
  };

  const confirmDelete = () => {
    confirmModal.open({
      header: 'Delete Items',
      confirm: deleteIntents,
      confirmButtonText: 'Delete',

      body: (
        <>
          Are you sure you want to delete {nluManager.selectedIntentIDs.size} item(s)?
          <br />
          This action cannot be undone.
        </>
      ),
    });
  };

  return (
    <TableToolbar width={450} isOpen={nluManager.selectedIntentIDs.size >= 1}>
      <TableToolbar.LeftActions>
        <TableToolbar.SelectCheckbox onClick={resetSelectedIntents} />
        <TableToolbar.TextBox>{nluManager.selectedIntentIDs.size} intents selected</TableToolbar.TextBox>
      </TableToolbar.LeftActions>

      <TableToolbar.Actions>
        <TableToolbar.Icon icon="trash" onClick={confirmDelete} />
        <PrimaryButton onClick={exportIntents} squareRadius>
          Export
        </PrimaryButton>
      </TableToolbar.Actions>
    </TableToolbar>
  );
};

export default IntentTableToolbar;
