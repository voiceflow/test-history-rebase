import { transformStringVariableToNumber } from '@voiceflow/common';
import { Flex, toast } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import TestVariableStateSelect from '@/components/TestVariableStateSelect';
import VariableList from '@/components/VariableList';
import * as variableState from '@/ducks/variableState';
import { useDispatch, useSelector, useTheme } from '@/hooks';
import { Variable } from '@/models';
import { SlideOutDirection } from '@/styles/transitions';

import { NoVariablesPlaceholder, SelectContainer, VariableListContainer } from './components';

const TestVariablesSidebar: React.FC = () => {
  const theme = useTheme();
  const variables = useSelector(variableState.selectedVariablesStateVariables);
  const selectedVariableStateId = useSelector(variableState.selectedVariableStateId);
  const updateSelectedVariableStateById = useDispatch(variableState.updateSelectedVariableStateById);
  const updateSelectedVariableStateVariables = useDispatch(variableState.updateSelectedVariableStateVariables);
  const updateStateValues = useDispatch(variableState.updateStateValues);
  const selectedSavedState = useSelector(variableState.selectedVariableStateSavedState);
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);

  const onChangeVariable = ({ name, value }: Variable) => {
    updateSelectedVariableStateVariables({ [name]: transformStringVariableToNumber(value as string | number | null) });
  };

  const handleVariableStateSelection = (variableStateId: string | null) => {
    updateSelectedVariableStateById(variableStateId);
  };

  const onUpdateStateValues = async () => {
    setLoading(true);

    try {
      await updateStateValues();
      toast.success('Variable state values updated');
    } catch (e) {
      toast.error('Failed to update variable state values');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedSavedState) {
      updateSelectedVariableStateVariables(selectedSavedState.variables);
    }
  }, [selectedSavedState]);

  return (
    <Drawer
      as="section"
      open={isOpen}
      width={theme.components.testVariablesSidebar.width}
      zIndex={25}
      direction={SlideOutDirection.RIGHT}
      closable
      onToggle={setIsOpen}
    >
      <Flex column fullHeight>
        <SelectContainer>
          <TestVariableStateSelect
            onChange={(value) => handleVariableStateSelection(value)}
            onUpdateStateValues={onUpdateStateValues}
            value={selectedVariableStateId}
            loading={loading}
          />
        </SelectContainer>
        {selectedVariableStateId ? (
          <VariableListContainer>
            <VariableList variables={variables} onChange={onChangeVariable} disabled={loading} />
          </VariableListContainer>
        ) : (
          <NoVariablesPlaceholder>No variable state selected</NoVariablesPlaceholder>
        )}
      </Flex>
    </Drawer>
  );
};

export default TestVariablesSidebar;
