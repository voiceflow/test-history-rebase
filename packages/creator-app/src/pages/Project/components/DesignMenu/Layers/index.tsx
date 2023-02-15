import { useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import Resizable, { ResizablePanel } from '@/components/Resizable';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

import ComponentsSection from './ComponentsSection';
import * as S from './styles';
import TopicsSection from './TopicsSection';

const DEFAULT_HEADER_HEIGHT = 34;

const Layers: React.FC = () => {
  const activeProjectID = useSelector(Session.activeProjectIDSelector);

  const [heights, setHeights] = useLocalStorageState<number[]>(`dm-layers-heights.${activeProjectID}`, []);

  return (
    <S.Container>
      <Resizable onResized={setHeights}>
        <ResizablePanel height={heights[0]} minHeight={DEFAULT_HEADER_HEIGHT + 23} className="ResizablePanel">
          {() => <TopicsSection />}
        </ResizablePanel>

        <ResizablePanel height={heights[1]} minHeight={DEFAULT_HEADER_HEIGHT + 20}>
          {({ setHeight, collapsed }) => <ComponentsSection collapsed={collapsed} setSectionHeight={setHeight} />}
        </ResizablePanel>
      </Resizable>
    </S.Container>
  );
};

export default Layers;
