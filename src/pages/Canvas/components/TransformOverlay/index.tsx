import React from 'react';

import { BlockType } from '@/constants';

import { OverlayControls, ResizeHandle } from './components';
// import { OverlayControls, ResizeHandle, RotateHandle, VertexHandle } from './components';
import { SCALE_HANDLES } from './constants';

const TransformOverlay = () => (
  <OverlayControls>
    {({ nodeType, onResizeStart }) => {
      // {({ nodeType, data, onResizeStart, onRotateStart, onDragVertex }) => {
      if (nodeType === BlockType.MARKUP_TEXT) {
        return (
          <>
            {SCALE_HANDLES.map((handle) => (
              <ResizeHandle position={handle} onDragStart={onResizeStart(handle)} key={handle} />
            ))}
            {/* TODO: re-enable other transform actions */}
            {/* {TEXT_HANDLES.map((handle) => (
              <ResizeHandle position={handle} onDragStart={onResizeStart(handle)} key={handle} />
            ))} */}
            {/* <RotateHandle onDragStart={onRotateStart} /> */}
          </>
        );
      }

      if ([BlockType.MARKUP_SHAPE, BlockType.MARKUP_IMAGE].includes(nodeType!)) {
        // if (isShape(data) && isLine(data)) {
        //   const { offsetX, offsetY } = data;
        //   const originX = Math.max(0, -offsetX);
        //   const originY = Math.max(0, -offsetY);

        //   return (
        //     <>
        //       <VertexHandle point={[originX, originY]} onDragStart={onDragVertex('origin')} />
        //       <VertexHandle point={[originX + offsetX, originY + offsetY]} onDragStart={onDragVertex('terminal')} />
        //     </>
        //   );
        // }

        return (
          <>
            {SCALE_HANDLES.map((handle) => (
              <ResizeHandle position={handle} onDragStart={onResizeStart(handle)} key={handle} />
            ))}
            {/* <RotateHandle onDragStart={onRotateStart} /> */}
          </>
        );
      }

      return null;
    }}
  </OverlayControls>
);

export default TransformOverlay;
