import { transformStringVariableToNumber } from '@voiceflow/common';
import { Flex, FlexCenter, LoadCircle, toast, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import TestVariableStateSelect from '@/components/TestVariableStateSelect';
import VariableList from '@/components/VariableList';
import * as Session from '@/ducks/session';
import * as variableState from '@/ducks/variableState';
import { useDispatch, useSelector, useTheme } from '@/hooks';
import { Variable } from '@/models';

import { SideBarComponentProps } from '../../types';
import { SelectContainer, VariableListContainer } from './components';

const TestVariablesSidebar: React.FC<SideBarComponentProps> = () => {
  const theme = useTheme();
  const variables = useSelector(variableState.selectedVariablesStateVariablesSelector);
  const selectedVariableStateId = useSelector(variableState.selectedVariableStateIdSelector);
  const isTestVariablesSidebarOpen = useSelector(Session.isPrototypeSidebarVisibleSelector);

  const updateSelectedVariableStateById = useDispatch(variableState.updateSelectedVariableStateById);
  const updateSelectedVariableStateVariables = useDispatch(variableState.updateSelectedVariableStateVariables);
  const resetVariableStates = useDispatch(variableState.resetVariableStates);
  const updateStateValues = useDispatch(variableState.updateStateValues);
  const updateIsTestVariablesSidebarOpen = useDispatch(Session.setPrototypeSidebarVisible);
  const selectedSavedState = useSelector(variableState.selectedVariableStateSavedStateSelector);
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = useSessionStorageState('sidebarOpen', false);

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

  const handleToggle = (value: boolean) => {
    setIsOpen(value);
    updateIsTestVariablesSidebarOpen(value);
  };

  React.useEffect(() => {
    if (selectedVariableStateId === variableState.ALL_PROJECT_VARIABLES_ID) return;

    if (!selectedSavedState) {
      resetVariableStates();
      return;
    }

    updateSelectedVariableStateVariables(selectedSavedState.variables);
  }, [selectedSavedState]);

  React.useEffect(() => {
    if (isTestVariablesSidebarOpen !== isOpen) {
      setIsOpen(isTestVariablesSidebarOpen);
    }
  }, [isTestVariablesSidebarOpen]);

  return (
    <Drawer
      open={isOpen}
      width={theme.components.testVariablesSidebar.width}
      zIndex={25}
      closable
      onToggle={handleToggle}
      direction={Drawer.Direction.RIGHT}
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
