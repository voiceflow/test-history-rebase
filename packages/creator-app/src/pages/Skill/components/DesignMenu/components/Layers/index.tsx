import React from 'react';

import Resizable, { ResizablePanel } from '@/components/Resizable';
import * as Session from '@/ducks/session';
import { useLocalStorageState, useSelector } from '@/hooks';

import { ComponentsSection, Container, TopicsSection } from './components';

const Layers: React.FC = () => {
  const activeProjectID = useSelector(Session.activeProjectIDSelector);

  const [heights, setHeights] = useLocalStorageState<number[]>(`dm-layers-heights.${activeProjectID}`, []);

  return (
    <Container>
      <Resizable onResized={setHeights}>
        <ResizablePanel height={heights[0]} minHeight={132}>
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
