import { transformStringVariableToNumber } from '@voiceflow/common';
import { Flex, FlexCenter, LoadCircle, toast } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import TestVariableStateSelect from '@/components/TestVariableStateSelect';
import VariableList from '@/components/VariableList';
import * as variableState from '@/ducks/variableState';
import { useDispatch, useSelector, useTheme } from '@/hooks';
import { Variable } from '@/models';
import { SlideOutDirection } from '@/styles/transitions';

import { SelectContainer, VariableListContainer } from './components';

const TestVariablesSidebar: React.FC = () => {
  const theme = useTheme();
  const variables = useSelector(variableState.selectedVariablesStateVariablesSelector);
  const selectedVariableStateId = useSelector(variableState.selectedVariableStateIdSelector);
  const updateSelectedVariableStateById = useDispatch(variableState.updateSelectedVariableStateById);
  const updateSelectedVariableStateVariables = useDispatch(variableState.updateSelectedVariableStateVariables);
  const updateStateValues = useDispatch(variableState.updateStateValues);
  const selectedSavedState = useSelector(variableState.selectedVariableStateSavedStateSelector);
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
    if (selectedVariableStateId === variableState.ALL_PROJECT_VARIABLES_ID) return;

    if (!selectedSavedState) {
      updateSelectedVariableStateById(variableState.ALL_PROJECT_VARIABLES_ID);
      return;
    }

    updateSelectedVariableStateVariables(selectedSavedState.variables);
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
      {variables?.length ? (
        <Flex column fullHeight>
          <SelectContainer>
            <TestVariableStateSelect
              value={selectedVariableStateId}
              loading={loading}
              onChange={(value) => handleVariableStateSelection(value)}
              onUpdateStateValues={onUpdateStateValues}
            />
          </SelectContainer>
          <VariableListContainer>
            <VariableList variables={variables} onChange={onChangeVariable} disabled={loading} />
          </VariableListContainer>
        </Flex>
      ) : (
        <FlexCenter style={{ height: '100%' }}>
          <LoadCircle />
        </FlexCenter>
      )}
    </Drawer>
  );
};

export default TestVariablesSidebar;
