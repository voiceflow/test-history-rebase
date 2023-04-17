import React from 'react';

import TableToolbar from '@/pages/NLUManager/components/TableToolbar';
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
    <TableToolbar width={450} isOpen={nluManager.selectedEntityIDs.size >= 2}>
      <TableToolbar.LeftActions>
        <TableToolbar.SelectCheckbox onClick={resetEntitiesSelection} />
        <TableToolbar.TextBox>{nluManager.selectedEntityIDs.size} entities selected</TableToolbar.TextBox>
      </TableToolbar.LeftActions>

      <TableToolbar.Actions>
        <TableToolbar.Icon icon="trash" onClick={deleteEntities} />
      </TableToolbar.Actions>
    </TableToolbar>
  );
};

export default EntityTableToolbar;
