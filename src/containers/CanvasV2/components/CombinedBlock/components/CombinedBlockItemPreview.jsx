import React from 'react';

import Flex from '@/componentsV2/Flex';
import NestedBlockOverlay from '@/containers/CanvasV2/components/NestedBlock/components/NestedBlockOverlay';
import PortLabel from '@/containers/CanvasV2/components/Port/components/PortLabel';
import { EngineProvider } from '@/containers/CanvasV2/contexts';

import CombinedBlockItemPreviewContainer from './CombinedBlockItemPreviewContainer';

const CombinedBlockItemPreview = ({ color, data, engine, getRect }) => {
  return (
    <EngineProvider value={engine}>
      <CombinedBlockItemPreviewContainer rect={getRect()} zoom={engine.canvas.getZoom()} isActive column>
        <Flex fullWidth>
          <PortLabel fullWidth>{data.name}</PortLabel>
        </Flex>
        <NestedBlockOverlay color={color} isSelected />
      </CombinedBlockItemPreviewContainer>
    </EngineProvider>
  );
};

export default React.memo(CombinedBlockItemPreview);
