import { System, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { VariableItem } from '@/components/SlateEditable/editor';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useModals, useOrderedVariables } from '@/hooks';
import ListItem from '@/pages/Canvas/components/NLUQuickView/components/Sidebar/components/ListItem';
import { useListHooks } from '@/pages/Canvas/components/NLUQuickView/components/Sidebar/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { useFilteredList } from '@/pages/Canvas/components/NLUQuickView/hooks';

import { SectionSection } from '.';
import { SectionProps } from './types';

const VariablesList: React.FC<SectionProps> = ({ search, setSearchLength, selectedID, setSelectedItemID, setActiveTab }) => {
  const { activeTab } = React.useContext(NLUQuickViewContext);

  const createVariableModal = useModals<{ onCreated: (variables: string[]) => void; creationType: Tracking.CanvasCreationType }>(
    ModalType.VARIABLE_CREATE
  );

  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.VARIABLES, [activeTab]);
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

  const onCreateVariable = () => createVariableModal.open({ onCreated: setJustAddedVariables, creationType: Tracking.CanvasCreationType.IMM });

  return (
    <SectionSection
      suffix={
        isActiveTab && (
          <TippyTooltip content="Create variable" position="top">
            <System.IconButtonsGroup.Base mr={-12}>
              <System.IconButton.Base icon="plus" onClick={onCreateVariable} />
            </System.IconButtonsGroup.Base>
          </TippyTooltip>
        )
      }
      header="Variables"
      onClick={() => setActiveTab(InteractionModelTabType.VARIABLES)}
      isExpanded={isActiveTab && !!filteredList.length}
      isCollapsed={!isActiveTab}
      headerToggle
      collapseVariant={isActiveTab ? null : SectionToggleVariant.ARROW}
    >
      {filteredList.map((variable, index) => {
        const isActive = selectedID ? selectedID === variable.id : index === 0;

        return (
          <ListItem
            id={variable.id}
            key={variable.id}
            name={variable.name}
            type={InteractionModelTabType.VARIABLES}
            active={isActive}
            onClick={() => setSelectedItemID(variable.id)}
            onDelete={() => isActive && firstItem && setSelectedItemID(firstItem.id)}
            nameValidation={(text) => text}
          />
        );
      })}
    </SectionSection>
  );
};

export default VariablesList;
