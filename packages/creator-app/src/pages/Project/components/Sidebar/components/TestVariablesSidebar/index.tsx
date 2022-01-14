import { Flex } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import TestVariableStateSelect from '@/components/TestVariableStateSelect';
import VariableList from '@/components/VariableList';
import { useTheme } from '@/hooks';
import { SlideOutDirection } from '@/styles/transitions';

import { NoVariablesPlaceholder, SelectContainer } from './components';

const TestVariablesSidebar: React.FC = () => {
  const theme = useTheme();
  const [variableState, setVariableState] = React.useState<string | null>(null);

  return (
    <Drawer as="section" open width={theme.components.testVariablesSidebar.width} zIndex={25} direction={SlideOutDirection.RIGHT}>
      <Flex column fullHeight>
        <SelectContainer>
          <TestVariableStateSelect onChange={(value) => setVariableState(value)} value={variableState} />
        </SelectContainer>
        {variableState ? (
          <VariableList
            variables={[
              { name: 'user_name', value: 'foo' },
              { name: 'user_age', value: '50' },
            ]}
          />
        ) : (
          <NoVariablesPlaceholder>No variable state selected</NoVariablesPlaceholder>
        )}
      </Flex>
    </Drawer>
  );
};

export default TestVariablesSidebar;
