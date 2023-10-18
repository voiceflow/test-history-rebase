import React from 'react';

import { InteractionModelTabType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import { useSelector } from '@/hooks';
import { useAllEntitiesSelector, useEntityMapSelector } from '@/hooks/entity.hook';
import { NLUQuickViewContext } from '@/ModalsV2/modals/NLU/QuickView/context';

export const useFilteredList = <Item extends { name: string }>(search: string, list: Item[]): Item[] =>
  React.useMemo(() => {
    const lowercasedSearch = search.toLowerCase().trim();

    return list.filter((item) => item.name.toLowerCase().includes(lowercasedSearch));
  }, [search, list]);

export const useShowForms = () => {
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);
  const allIntents = useSelector(IntentV2.allIntentsSelector);
  const slots = useAllEntitiesSelector();
  const slotsMap = useEntityMapSelector();

  const { activeTab, selectedID } = React.useContext(NLUQuickViewContext);

  const showIntentForm = activeTab === InteractionModelTabType.INTENTS && intentsMap[selectedID];
  const showEntityForm = activeTab === InteractionModelTabType.SLOTS && slotsMap[selectedID];
  const showVariableForm = activeTab === InteractionModelTabType.VARIABLES;

  const isEmpty = React.useMemo(() => {
    if (activeTab === InteractionModelTabType.INTENTS && allIntents.length === 0) {
      return true;
    }
    if (activeTab === InteractionModelTabType.SLOTS && slots.length === 0) {
      return true;
    }
    return false;
  }, [allIntents, activeTab, slots]);

  return {
    showIntentForm,
    showEntityForm,
    showVariableForm,
    isEmpty,
  };
};
