import { CustomScrollbars, Flex, FlexCenter, LoadCircle, useSessionStorageState } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import Drawer from '@/components/Drawer';
import TestVariableStateSelect from '@/components/TestVariableStateSelect';
import VariableList from '@/components/VariableList';
import * as Session from '@/ducks/session';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useSelector, useTheme } from '@/hooks';

import { SelectContainer, VariableListContainer } from './components';
import { usePrototypeContextVariables } from './hooks';

const TestVariablesSidebar: React.FC = () => {
  const theme = useTheme();
  const selectedVariables = useSelector(VariableState.selectedVariablesStateVariablesSelector);
  const selectedSavedState = useSelector(VariableState.selectedVariableStateSavedStateSelector);
  const selectedVariableState = useSelector(VariableState.selectedVariableStateSelector);
  const isTestVariablesSidebarOpen = useSelector(Session.isPrototypeSidebarVisibleSelector);

  const updateStateValues = useDispatch(VariableState.updateStateValues);
  const updateSelectedVariableStateByID = useDispatch(VariableState.updateSelectedVariableStateById);
  const updateIsTestVariablesSidebarOpen = useDispatch(Session.setPrototypeSidebarVisible);
  const updateSelectedVariableStateVariables = useDispatch(VariableState.updateSelectedVariableStateVariables);

  const [isOpen, setIsOpen] = useSessionStorageState('sidebarOpen', false);
  const [loading, setLoading] = React.useState(false);

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

  const onToggle = (value: boolean) => {
    setIsOpen(value);
    updateIsTestVariablesSidebarOpen(value);
  };

  React.useEffect(() => {
    if (!selectedVariableState) {
      updateSelectedVariableStateByID(VariableState.ALL_PROJECT_VARIABLES_ID);
    }
  }, [selectedVariableState]);

  React.useEffect(() => {
    if (selectedSavedState) {
      updateSelectedVariableStateVariables(selectedSavedState.variables);
    }
  }, [selectedSavedState]);

  React.useEffect(() => {
    if (isTestVariablesSidebarOpen !== isOpen) {
      setIsOpen(isTestVariablesSidebarOpen);
    }
  }, [isTestVariablesSidebarOpen]);

  const [variables, onChangeVariable] = usePrototypeContextVariables(selectedVariables, updateSelectedVariableStateVariables);

  return (
    <Drawer
      open={isOpen}
      width={theme.components.testVariablesSidebar.width}
      zIndex={25}
      closable
      onToggle={onToggle}
      direction={Drawer.Direction.RIGHT}
    >
      {variables?.length ? (
        <Flex column fullHeight>
          <SelectContainer>
            <TestVariableStateSelect
              value={selectedVariableState?.id}
              loading={loading}
              onChange={updateSelectedVariableStateByID}
              onUpdateStateValues={onUpdateStateValues}
            />
          </SelectContainer>

          <CustomScrollbars height="100%">
            <VariableListContainer>
              <VariableList variables={variables} onChange={onChangeVariable} disabled={loading} />
            </VariableListContainer>
          </CustomScrollbars>
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
