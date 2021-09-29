import React from 'react';

import Resizable, { ResizablePanel } from '@/components/Resizable';
import { useLocalStorageState } from '@/hooks';

import { ComponentsSection, Container, TopicsSection } from './components';

const Layers: React.FC = () => {
  const [heights, setHeights] = useLocalStorageState<number[]>('design-menu-layers-heights', []);

  return (
    <Container>
      <Resizable onResized={setHeights}>
        <ResizablePanel height={heights[0]} minHeight={150}>
          {() => <TopicsSection />}
        </ResizablePanel>

        <ResizablePanel height={heights[1]} minHeight={40}>
          {({ collapsed }) => <ComponentsSection collapsed={collapsed} />}
        </ResizablePanel>
      </Resizable>
    </Container>
  );
};

export default Layers;
