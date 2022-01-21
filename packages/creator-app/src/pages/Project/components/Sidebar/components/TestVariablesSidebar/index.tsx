import { transformStringVariableToNumber } from '@voiceflow/common';
import { Flex } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import TestVariableStateSelect from '@/components/TestVariableStateSelect';
import VariableList from '@/components/VariableList';
import * as Prototype from '@/ducks/prototype';
import * as variableState from '@/ducks/variableState';
import { useDispatch, useSelector, useTheme } from '@/hooks';
import { SlideOutDirection } from '@/styles/transitions';

import { NoVariablesPlaceholder, SelectContainer } from './components';

const TestVariablesSidebar: React.FC = () => {
  const theme = useTheme();
  const variables = useSelector(variableState.selectedVariablesStateVariables);
  const variableStateId = useSelector(variableState.selectedVariableStateId);
  const updateSelectedVariableStateId = useDispatch(variableState.updateSelectedVariableStateId);
  const updateVariables = useDispatch(Prototype.updateVariables);

  const onChangeVariable = ({ name, value }: { name: string; value: string }) => {
    updateVariables({ [name]: transformStringVariableToNumber(value) });
  };

  return (
    <Drawer as="section" open width={theme.components.testVariablesSidebar.width} zIndex={25} direction={SlideOutDirection.RIGHT}>
      <Flex column fullHeight>
        <SelectContainer>
          <TestVariableStateSelect onChange={(value) => updateSelectedVariableStateId(value)} value={variableStateId} />
        </SelectContainer>
        {variableStateId ? (
          <VariableList variables={variables} onChange={onChangeVariable} />
        ) : (
          <NoVariablesPlaceholder>No variable state selected</NoVariablesPlaceholder>
        )}
      </Flex>
    </Drawer>
  );
};

export default TestVariablesSidebar;
