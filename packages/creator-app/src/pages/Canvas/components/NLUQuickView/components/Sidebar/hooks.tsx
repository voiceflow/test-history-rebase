import React from 'react';

import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';

export const useUpdateSearchCount = (setSearchLength: (length: number) => void, length = 0, isActiveTab: boolean) => {
  React.useEffect(() => {
    if (isActiveTab) {
      setSearchLength(length);
    }
  }, [isActiveTab, length]);
};

export const useUpdateContentTitle = (isActiveTab: boolean, itemMap: Record<string, any>, selectedID: string, setTitle: (title: string) => void) => {
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
  map: Record<string, any>;
}

export const useSectionHooks = ({ setSearchLength, listLength, isActiveTab, map }: SectionHooksProps) => {
  const { selectedID, setTitle } = React.useContext(NLUQuickViewContext);

  useUpdateSearchCount(setSearchLength, listLength, isActiveTab);
  useUpdateContentTitle(isActiveTab, map, selectedID, setTitle);
};
