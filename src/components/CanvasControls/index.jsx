import React from 'react';

import { CanvasContext } from '@/components/Canvas/contexts';
import IconButton from '@/componentsV2/IconButton';
import { stopPropagation } from '@/utils/dom';

import CanvasControlsZoom from './components/CanvasControlsZoom';

const ZOOM_DELTA = 10;

function CanvasControls() {
  const canvas = React.useContext(CanvasContext);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onMouseDown={stopPropagation()}>
      <CanvasControlsZoom>
        <IconButton icon="zoomIn" onClick={() => canvas.zoomIn(ZOOM_DELTA)} />
        <IconButton icon="zoomOut" onClick={() => canvas.zoomOut(ZOOM_DELTA)} />
      </CanvasControlsZoom>
      <IconButton icon="home" onClick={canvas.reorient} />
    </div>
  );
}

export default CanvasControls;
