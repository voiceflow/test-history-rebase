import React from 'react';

import Drawer from '@/components/Drawer';
import { useTheme } from '@/hooks';
import { SlideOutDirection } from '@/styles/transitions';

import { Container } from './components';

const TestVariablesSidebar: React.FC = () => {
  const theme = useTheme();

  return (
    <Drawer as="section" open width={theme.components.testVariablesSidebar.width} zIndex={25} direction={SlideOutDirection.RIGHT}>
      <Container></Container>
    </Drawer>
  );
};

export default TestVariablesSidebar;
