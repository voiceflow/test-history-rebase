import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockType } from '@/constants';

import { OverlayControls, ResizeHandle, RotateHandle } from './components';
import { SCALE_HANDLES, TEXT_HANDLES } from './constants';

const TransformOverlay = () => (
  <OverlayControls>
    {({ nodeType, onResizeStart, onRotateStart }) => {
      if (nodeType === BlockType.MARKUP_TEXT) {
        return (
          <>
            {TEXT_HANDLES.map((handle) => (
              <ResizeHandle position={handle} onDragStart={onResizeStart(handle)} key={handle} />
            ))}

            <RotateHandle onDragStart={onRotateStart} />
          </>
        );
      }

      if (Realtime.Utils.typeGuards.isMarkupMediaBlockType(nodeType)) {
        return (
          <>
            {SCALE_HANDLES.map((handle) => (
              <ResizeHandle position={handle} onDragStart={onResizeStart(handle)} key={handle} />
            ))}

            <RotateHandle onDragStart={onRotateStart} />
          </>
        );
      }

      return null;
    }}
  </OverlayControls>
);

export default TransformOverlay;
