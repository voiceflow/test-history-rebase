import React from 'react';
import ReactDOM from 'react-dom';

import Flex from '@/components/Flex';
import * as IconButton from '@/components/IconButton';
import { styled } from '@/hocs';
import { stopPropagation } from '@/utils/dom';

import { CanvasContext } from './contexts';
import Canvas from '.';

const ZOOM_DELTA = 10;

const ZoomControls = styled(Flex)`
  & ${IconButton.Container} {
    box-shadow: none;
  }

  & ${IconButton.Container}:not(:last-of-type) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  & ${IconButton.Container}:not(:first-of-type) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

function Controls() {
  const canvas = React.useContext(CanvasContext);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onMouseDown={stopPropagation()}>
      <ZoomControls>
        <IconButton icon="zoomIn" onClick={() => canvas.zoomIn(ZOOM_DELTA)} />
        <IconButton icon="zoomOut" onClick={() => canvas.zoomOut(ZOOM_DELTA)} />
      </ZoomControls>
      <IconButton icon="home" onClick={canvas.reorient} />
    </div>
  );
}

export default {
  title: 'Canvas',
  component: Canvas,
  includeStories: [],
};

export const normal = () => {
  const overlayRef = React.useRef();
  const [, updateState] = React.useState(false);

  React.useEffect(() => updateState(), []);

  return (
    <div style={{ position: 'relative', height: 400, width: 400, border: '1px solid black' }}>
      <div style={{ position: 'absolute', zIndex: 10, pointerEvents: 'none' }} ref={overlayRef} />
      <Canvas>
        {overlayRef.current && ReactDOM.createPortal(<Controls />, overlayRef.current)}
        <div style={{ position: 'absolute', top: 40, left: 40, height: 40, width: 40, background: 'red' }} />
        <div style={{ position: 'absolute', top: 280, left: 120, height: 10, width: 30, background: 'blue' }} />
        <div style={{ position: 'absolute', top: 140, left: 300, height: 60, width: 60, borderRadius: '50%', background: 'yellow' }} />
      </Canvas>
    </div>
  );
};
