import { Utils } from '@voiceflow/common';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useDidUpdateEffect } from '@/hooks';
import { NLUQuickViewContext } from '@/ModalsV2/modals/NLU/QuickView/context';

import ListItem from './components/ListItem';

export const useUpdateSearchCount = (setSearchLength: (length: number) => void, length = 0, isActiveTab: boolean) => {
  React.useEffect(() => {
    if (isActiveTab) {
      setSearchLength(length);
    }
  }, [isActiveTab, length]);
};

export const useUpdateContentTitle = (
  isActiveTab: boolean,
  itemMap: Record<string, { name: string }>,
  selectedID: string,
  setTitle: (title: string) => void
) => {
  React.useEffect(() => {
    if (itemMap[selectedID]) {
      setTitle(itemMap[selectedID]?.name || '');
    }
  }, [isActiveTab, itemMap, selectedID]);
};

export const useSetInitialItem = (
  isActiveTab: boolean,
  selectedID: string,
  setSelectedID: (id: string) => void,
  list: { id: string }[],
  itemMap: Record<string, any>
) => {
  const [lastItemID, setLastItemID] = React.useState('');

  React.useEffect(() => {
    const targetItemID = itemMap[selectedID]?.id;
    if (targetItemID) {
      setLastItemID(targetItemID);
    }
  }, [selectedID, itemMap]);

  React.useEffect(() => {
    if (isActiveTab && (!selectedID || !itemMap[selectedID])) {
      if (itemMap[lastItemID]) {
        setSelectedID(lastItemID);
      } else {
        setSelectedID(list[0]?.id || '');
      }
    }
  }, [isActiveTab, selectedID, list, itemMap, lastItemID]);
};

interface SectionHooksProps {
  setSearchLength: (length: number) => void;
  listLength: number;
  isActiveTab: boolean;
  map: Record<string, { name: string }>;
}

export const useListHooks = ({ setSearchLength, listLength, isActiveTab, map }: SectionHooksProps) => {
  const { selectedID, setTitle } = React.useContext(NLUQuickViewContext);

  useUpdateSearchCount(setSearchLength, listLength, isActiveTab);
  useUpdateContentTitle(isActiveTab, map, selectedID, setTitle);
};

interface itemType {
  name: string;
  id: string;
}

interface useCreatingItemProps {
  itemMap: Record<string, itemType>;
  nameValidation: (name: string, type: InteractionModelTabType) => string;
  onBlur: (name: string, newItemID: string) => void;
  forceCreate: number;
}

export interface useCreatingProps {
  createNewItemComponent: () => JSX.Element | null;
  setIsCreating: (val: boolean) => void;
  setNewItemID: (newID: string) => void;
  isCreating: boolean;
  resetCreating: () => void;
  newItemID: string | null;
}

export const useCreatingItem = ({ itemMap, nameValidation, onBlur, forceCreate }: useCreatingItemProps): useCreatingProps => {
  const [isCreating, setIsCreating] = React.useState(false);
  const [newItemID, setNewItemID] = React.useState<string | null>(null);

  const newItem = newItemID ? itemMap[newItemID] : null;

  useDidUpdateEffect(() => {
    setIsCreating(true);
  }, [forceCreate]);

  const resetCreating = () => {
    setIsCreating(false);
    setNewItemID(null);
  };

  const handleBlur = (newName: string, newItemID: string) => {
    if (!newName.trim() && newItem) {
      // if empty, go back to old name
      onBlur(newItem.name, newItemID);
    } else {
      onBlur(newName, newItemID);
    }
  };

  const createNewItemComponent = () =>
    isCreating && newItem ? (
      <ListItem
        id={newItem.id}
        type={InteractionModelTabType.VARIABLES}
        name={newItem.name}
        active
        onClick={Utils.functional.noop}
        nameValidation={(name) => nameValidation(name, InteractionModelTabType.VARIABLES)}
        isCreating
        onBlur={(newName) => handleBlur(newName, newItemID!)}
      />
    ) : null;

  return { createNewItemComponent, resetCreating, setIsCreating, setNewItemID, newItemID, isCreating };
};
