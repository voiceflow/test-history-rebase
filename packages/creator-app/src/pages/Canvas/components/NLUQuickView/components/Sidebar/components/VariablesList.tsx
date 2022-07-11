import { IconButton, IconButtonVariant, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { VariableItem } from '@/components/SlateEditable/editor';
import { InteractionModelTabType, ModalType } from '@/constants';
import { useModals, useOrderedVariables } from '@/hooks';
import ListItem from '@/pages/Canvas/components/NLUQuickView/components/Sidebar/components/ListItem';
import { useListHooks } from '@/pages/Canvas/components/NLUQuickView/components/Sidebar/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { useFilteredList } from '@/pages/Canvas/components/NLUQuickView/hooks';

import { SectionSection } from '.';
import { SectionProps } from './types';

const VariablesList: React.FC<SectionProps> = ({ search, setSearchLength, selectedID, setSelectedItemID, setActiveTab }) => {
  const { activeTab } = React.useContext(NLUQuickViewContext);

  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.VARIABLES, [activeTab]);
  const { open: openVariableCreate } = useModals(ModalType.VARIABLE_CREATE);
  const [justAddedVariables, setJustAddedVariables] = React.useState<string[] | null>(null);

  const [variables, variablesMap] = useOrderedVariables();

  const filteredList = useFilteredList(search, variables) as VariableItem[];
  const firstItem = React.useMemo(() => filteredList.find((item) => item.id), [filteredList]);

  useListHooks({
    map: variablesMap,
    listLength: variables.length,
    isActiveTab,
    setSearchLength,
  });

  // Auto select first new variable on creation
  React.useEffect(() => {
    const firstAddedVariable = justAddedVariables?.[0];

    if (!firstAddedVariable) return;

    variables.forEach((variable) => {
      if (variable.name === firstAddedVariable) {
        setSelectedItemID(variable.id);
      }
    });
  }, [justAddedVariables, variables]);

  const onCreateVariable = () => {
    openVariableCreate({
      onCreate: (variableNames: string[]) => {
        if (variableNames.length) {
          setJustAddedVariables(variableNames);
        }
      },
    });
  };

  return (
    <SectionSection
      isExpanded={isActiveTab && !!filteredList.length}
      onClick={() => setActiveTab(InteractionModelTabType.VARIABLES)}
      isCollapsed={!isActiveTab}
      header="Variables"
      headerToggle
      collapseVariant={isActiveTab ? null : SectionToggleVariant.ARROW}
      suffix={
        isActiveTab && (
          <TippyTooltip title="Create variable" position="top">
            <IconButton style={{ marginRight: -12 }} onClick={onCreateVariable} variant={IconButtonVariant.BASIC} icon="plus" />
          </TippyTooltip>
        )
      }
    >
      {filteredList.map((variable, index) => {
        const isActive = selectedID ? selectedID === variable.id : index === 0;
        return (
          <ListItem
            type={InteractionModelTabType.VARIABLES}
            id={variable.id}
            active={isActive}
            onClick={() => setSelectedItemID(variable.id)}
            onDelete={() => isActive && firstItem && setSelectedItemID(firstItem.id)}
            key={variable.id}
            name={variable.name}
            nameValidation={(text) => text}
          />
        );
      })}
    </SectionSection>
  );
};

export default VariablesList;
