import { PrimaryButton, Table } from '@voiceflow/ui';
import React from 'react';

import * as ModalsV2 from '@/ModalsV2';
import { useConfirmModal } from '@/ModalsV2/hooks';
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
    <Table.Toolbar width={450} isOpen={nluManager.selectedIntentIDs.size >= 1}>
      <Table.Toolbar.LeftActions>
        <Table.Toolbar.SelectCheckbox onClick={resetSelectedIntents} />
        <Table.Toolbar.TextBox>{nluManager.selectedIntentIDs.size} intents selected</Table.Toolbar.TextBox>
      </Table.Toolbar.LeftActions>

      <Table.Toolbar.Actions>
        <Table.Toolbar.Icon icon="trash" onClick={confirmDelete} />
        <PrimaryButton onClick={exportIntents} squareRadius>
          Export
        </PrimaryButton>
      </Table.Toolbar.Actions>
    </Table.Toolbar>
  );
};

export default IntentTableToolbar;
