import { Table } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

const EntityTableToolbar: React.FC = () => {
  const nluManager = useNLUManager();

  const resetEntitiesSelection = () => {
    nluManager.setSelectedEntityIDs([]);
  };

  const deleteEntities = async () => {
    await nluManager.deleteEntities();
    resetEntitiesSelection();
  };

  return (
    <Table.Toolbar width={450} isOpen={nluManager.selectedEntityIDs.size >= 2}>
      <Table.Toolbar.LeftActions>
        <Table.Toolbar.SelectCheckbox onClick={resetEntitiesSelection} />
        <Table.Toolbar.TextBox>{nluManager.selectedEntityIDs.size} entities selected</Table.Toolbar.TextBox>
      </Table.Toolbar.LeftActions>

      <Table.Toolbar.Actions>
        <Table.Toolbar.Icon icon="trash" onClick={deleteEntities} />
      </Table.Toolbar.Actions>
    </Table.Toolbar>
  );
};

export default EntityTableToolbar;
