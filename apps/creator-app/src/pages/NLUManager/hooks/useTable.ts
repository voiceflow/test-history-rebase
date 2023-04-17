import { Utils } from '@voiceflow/common';
import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

const useTable = (activeItemID: string | null) => {
  const [renamingItemID, setRenamingItemID] = React.useState<string | null>(null);
  const [selectedItemIDs, setSelectedItemIDsSet] = React.useState<Set<string>>(() => new Set());

  const toggleSelectedItemID = React.useCallback((itemID: string) => {
    setSelectedItemIDs((selectedItemIDs, selectedItemIDsSet) =>
      selectedItemIDsSet.has(itemID) ? Utils.array.withoutValue(selectedItemIDs, itemID) : [...selectedItemIDs, itemID]
    );
  }, []);

  const deleteItems = (deletedItemIDs: string[]) => {
    setSelectedItemIDs(Utils.array.withoutValues(Array.from(selectedItemIDs), deletedItemIDs));
  };

  const deleteItem = (id: string) => {
    setSelectedItemIDs((selectedItemIDs) => Utils.array.withoutValue(selectedItemIDs, id));
  };

  const setSelectedItemIDs = (ids: string[] | ((ids: string[], set: Set<string>) => string[])) => {
    if (Array.isArray(ids)) {
      setSelectedItemIDsSet(new Set(ids));
    } else {
      setSelectedItemIDsSet((selectedItemIDs) => new Set(ids(Array.from(selectedItemIDs), selectedItemIDs)));
    }
  };

  useDidUpdateEffect(() => {
    setRenamingItemID(null);
  }, [activeItemID]);

  return {
    renamingItemID,
    selectedItemIDs,
    deleteItems,
    deleteItem,
    toggleSelectedItemID,
    setSelectedItemIDs,
    setRenamingItemID,
  };
};

export default useTable;
