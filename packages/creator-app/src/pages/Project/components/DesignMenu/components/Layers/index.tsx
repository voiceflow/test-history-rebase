import { useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import Resizable, { ResizablePanel } from '@/components/Resizable';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

import { ComponentsSection, Container, TopicsSection } from './components';

const DEFAULT_HEADER_HEIGHT = 42;

const Layers: React.FC = () => {
  const activeProjectID = useSelector(Session.activeProjectIDSelector);

  const [heights, setHeights] = useLocalStorageState<number[]>(`dm-layers-heights.${activeProjectID}`, []);

  return (
    <Container>
      <Resizable onResized={setHeights}>
        <ResizablePanel height={heights[0]} minHeight={DEFAULT_HEADER_HEIGHT}>
          {() => <TopicsSection />}
        </ResizablePanel>

        <ResizablePanel height={heights[1]} minHeight={DEFAULT_HEADER_HEIGHT}>
          {({ setHeight, collapsed }) => <ComponentsSection collapsed={collapsed} setSectionHeight={setHeight} />}
        </ResizablePanel>
      </Resizable>
    </Container>
  );
};

export default Layers;
