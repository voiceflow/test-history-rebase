import React from 'react';

import { NLUManagerContext } from '@/pages/NLUManager/context';

export const useTableSearch = (name: string) => {
  const { search } = React.useContext(NLUManagerContext);
  const inSearch = name.toLowerCase().includes(search.toLowerCase());

  return {
    inSearch,
  };
};

export const useIsCheckedItem = (itemID: string) => {
  const { checkedItems } = React.useContext(NLUManagerContext);

  const isChecked = React.useMemo(() => {
    return checkedItems.includes(itemID);
  }, [checkedItems, itemID]);
  return {
    isChecked,
  };
};

interface useTableOrderByProps {
  items: any[];
  sorters: Record<string, (itemA: any, itemB: any) => number>;
  startingSorter?: string;
}

export const useTableOrderBy = ({ items, sorters, startingSorter }: useTableOrderByProps) => {
  const [orderType, setOrderType] = React.useState<string>(startingSorter || '');
  const [descending, setDescending] = React.useState(true);
  const [orderedItems, setOrderedItems] = React.useState(items);

  const toggleOrderType = React.useCallback(
    (type: string) => {
      if (type === orderType) {
        setDescending(!descending);
      } else {
        setDescending(true);
        setOrderType(type);
      }
    },
    [orderType, descending]
  );

  React.useEffect(() => {
    setOrderedItems([...orderedItems].reverse());
  }, [descending]);

  React.useEffect(() => {
    const sorter = sorters[orderType];
    if (sorter) {
      const itemsCopy = [...items];
      itemsCopy.sort(sorter);
      setOrderedItems(itemsCopy);
    } else {
      setOrderedItems(items);
    }
  }, [orderType, items]);

  return {
    setOrderType: toggleOrderType,
    orderedItems,
    orderType,
    descending,
  };
};
