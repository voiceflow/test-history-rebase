import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUQuickViewContext } from '@/ModalsV2/modals/NLU/QuickView/context';

export const useFilteredList = <Item extends { name: string }>(search: string, list: Item[]): Item[] =>
  React.useMemo(() => {
    const lowercasedSearch = search.toLowerCase().trim();

    return list.filter((item) => item.name.toLowerCase().includes(lowercasedSearch));
  }, [search, list]);

export const useShowForms = () => {
  const { activeTab } = React.useContext(NLUQuickViewContext);
  const showVariableForm = activeTab === InteractionModelTabType.VARIABLES;

  return {
    showVariableForm,
    isEmpty: false,
  };
};
