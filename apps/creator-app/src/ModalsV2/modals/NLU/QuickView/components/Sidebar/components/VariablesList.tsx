import { System, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useOrderedVariables } from '@/hooks/variable';
import { useModal } from '@/ModalsV2/modal.hook';
import * as VariableModal from '@/ModalsV2/modals/NLU/Variable';

import { NLUQuickViewContext } from '../../../context';
import { useFilteredList } from '../../../hooks';
import { useListHooks } from '../hooks';
import ListItem from './ListItem';
import { SectionSection } from './styles';
import { SectionProps } from './types';

const VariablesList: React.FC<SectionProps> = ({ search, setSearchLength, selectedID, setSelectedItemID, setActiveTab }) => {
  const { activeTab } = React.useContext(NLUQuickViewContext);

  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.VARIABLES, [activeTab]);
  const [lastCreatedVariableName, setLastCreatedVariableName] = React.useState<string | null>(null);

  const createVariableModal = useModal(VariableModal.Create);
  const [variables, variablesMap] = useOrderedVariables();

  const filteredList = useFilteredList(search, variables);
  const firstItem = React.useMemo(() => filteredList.find((item) => item.id), [filteredList]);

  const onCreateVariable = async () => {
    const variables = await createVariableModal.open({ creationType: Tracking.CanvasCreationType.IMM });

    setLastCreatedVariableName(variables[0]);
  };

  useListHooks({
    map: variablesMap,
    listLength: variables.length,
    isActiveTab,
    setSearchLength,
  });

  // Auto select first new variable on creation
  React.useEffect(() => {
    if (!lastCreatedVariableName) return;

    const variable = variables.find((variable) => variable.name === lastCreatedVariableName);

    if (variable) {
      setSelectedItemID(variable.id);
    }
  }, [lastCreatedVariableName]);

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
