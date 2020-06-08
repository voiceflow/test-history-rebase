import React from 'react';

import { BlockType } from '@/constants';

import { OverlayControls, ResizeHandle, RotateHandle } from './components';
import { IMAGE_HANDLES, TEXT_HANDLES } from './constants';

const TransformOverlay = () => (
  <OverlayControls>
    {({ nodeType, onResizeStart, onRotateStart }) => {
      switch (nodeType) {
        case BlockType.MARKUP_SHAPE:
        case BlockType.MARKUP_IMAGE:
          return (
            <>
              {IMAGE_HANDLES.map((handle) => (
                <ResizeHandle position={handle} onDragStart={onResizeStart(handle)} key={handle} />
              ))}
              <RotateHandle onDragStart={onRotateStart} />
            </>
          );
        case BlockType.MARKUP_TEXT:
          return (
            <>
              {TEXT_HANDLES.map((handle) => (
                <ResizeHandle position={handle} onDragStart={onResizeStart(handle)} key={handle} />
              ))}
              <RotateHandle onDragStart={onRotateStart} />
            </>
          );
        default:
          return null;
      }
    }}
  </OverlayControls>
);

export default TransformOverlay;
