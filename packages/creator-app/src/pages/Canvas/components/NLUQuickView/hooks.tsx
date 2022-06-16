import React from 'react';

import { InteractionModelTabType, VariableType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Version from '@/ducks/version';
import { useDispatch, useOrderedVariables, useSelector } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';

export const useFilteredList = (search: string, list: { name: string }[]) => {
  return React.useMemo(() => {
    return list.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase().trim());
    });
  }, [search, list]);
};

export const useDeleteVariable = () => {
  const [, variablesMap] = useOrderedVariables();

  const removeGlobalVariable = useDispatch(Version.removeGlobalVariable);
  const removeVariableFromDiagram = useDispatch(Diagram.removeActiveDiagramVariable);

  return React.useCallback(
    (variableID: string) => {
      const variable = variablesMap[variableID];

      if (variable.type === VariableType.GLOBAL) {
        removeGlobalVariable(variable.name);
      } else {
        removeVariableFromDiagram(variable.name);
      }
    },
    [variablesMap, removeGlobalVariable, removeVariableFromDiagram]
  );
};

export const useShowForms = () => {
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);
  const slotsMap = useSelector(SlotV2.slotMapSelector);
  const allIntents = useSelector(IntentV2.allIntentsSelector);
  const slots = useSelector(SlotV2.allSlotsSelector);

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
