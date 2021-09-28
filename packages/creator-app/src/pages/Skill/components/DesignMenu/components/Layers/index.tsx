import React from 'react';

import Resizable, { ResizablePanel } from '@/components/Resizable';
import { useLocalStorageState } from '@/hooks';

const Layers = () => {
  const [heights, setHeights] = useLocalStorageState<number[]>('design-menu-layers-heights', []);

  return (
    <Resizable onResized={setHeights}>
      <ResizablePanel height={heights[0]} minHeight={150}>
        {({ collapsed }) => <div>Topics ,collapsed: {String(collapsed)}</div>}
      </ResizablePanel>

      <ResizablePanel height={heights[1]} minHeight={40}>
        {({ collapsed }) => <div>Components collapsed: {String(collapsed)}</div>}
      </ResizablePanel>
    </Resizable>
  );
};

export default Layers;
