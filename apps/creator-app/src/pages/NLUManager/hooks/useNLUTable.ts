import { toast } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUContext } from '@/contexts/NLUContext';

import useTable from './useTable';

const useNLUTable = (tabType: InteractionModelTabType, activeItemID: string | null, goToItem: (id: string | null) => void) => {
  const nlu = React.useContext(NLUContext);
  const table = useTable(activeItemID);

  const deleteItem = async (id: string) => {
    if (!nlu.canDeleteItem(id, tabType)) {
      toast.error(`Cannot delete item`);
      return;
    }

    try {
      await nlu.deleteItem(id, tabType);

      table.deleteItem(id);

      if (id === activeItemID) {
        goToItem(null);
      }
    } catch (e) {
      toast.error(`Cannot delete item`);
    }
  };

  const deleteItems = async () => {
    const deletedItemIDs = await nlu.deleteItems(Array.from(table.selectedItemIDs), tabType);

    if (!deletedItemIDs.length) {
      toast.error(`Cannot delete these items`);
      return;
    }

    try {
      table.deleteItems(deletedItemIDs);

      toast.success(`Deleted ${deletedItemIDs.length} items`);

      if (activeItemID && deletedItemIDs.includes(activeItemID)) {
        goToItem(null);
      }
    } catch (e) {
      toast.error(`Cannot delete these items`);
    }
  };

  return {
    ...table,
    deleteItem,
    deleteItems,
  };
};

export default useNLUTable;
