import { IconButton, IconButtonVariant, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { VariableItem } from '@/components/SlateEditable/editor';
import { InteractionModelTabType, ModalType } from '@/constants';
import { useModals } from '@/hooks';
import ListItem from '@/pages/Canvas/components/NLUQuickView/components/Sidebar/components/ListItem';
import { useSectionHooks } from '@/pages/Canvas/components/NLUQuickView/components/Sidebar/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { useFilteredList, useOrderedVariables } from '@/pages/Canvas/components/NLUQuickView/hooks';

import { SectionSection } from '.';
import { SectionProps } from './types';

const VariablesList: React.FC<SectionProps> = ({ search, setSearchLength, selectedID, setSelectedItemID, setActiveTab }) => {
  const { activeTab, deleteItem } = React.useContext(NLUQuickViewContext);

  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.VARIABLES, [activeTab]);
  const { open: openVariableCreate } = useModals(ModalType.VARIABLE_CREATE);
  const [justAddedVariables, setJustAddedVariables] = React.useState<string[] | null>(null);

  const { mergedVariables, mergedVariablesMap } = useOrderedVariables();

  const filteredList = useFilteredList(search, mergedVariables) as VariableItem[];

  useSectionHooks({
    setSearchLength,
    listLength: mergedVariables.length,
    isActiveTab,
    map: mergedVariablesMap,
  });

  // Auto select first new variable on creation
  React.useEffect(() => {
    const firstAddedVariable = justAddedVariables?.[0];
    if (!firstAddedVariable) return;
    mergedVariables.forEach((variable) => {
      if (variable.name === firstAddedVariable) {
        setSelectedItemID(variable.id);
      }
    });
  }, [justAddedVariables, mergedVariables]);

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
      {filteredList.map((variable, index) => (
        <ListItem
          type={InteractionModelTabType.VARIABLES}
          id={variable.id}
          active={selectedID ? selectedID === variable.id : index === 0}
          onClick={() => setSelectedItemID(variable.id)}
          key={variable.id}
          name={variable.name}
          onDelete={(id) => deleteItem(id, InteractionModelTabType.VARIABLES)}
          nameValidation={(text) => text}
        />
      ))}
    </SectionSection>
  );
};

export default VariablesList;
