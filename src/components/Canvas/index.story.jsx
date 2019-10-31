import { storiesOf } from '@storybook/react';
import React from 'react';
import ReactDOM from 'react-dom';

import { Variant, createTestableStory } from '@/../.storybook';
import CanvasControls from '@/components/CanvasControls';

import Canvas from '.';

storiesOf('Canvas', module).add(
  'variants',
  createTestableStory(() => {
    const overlayRef = React.useRef();
    const [, updateState] = React.useState(false);

    React.useEffect(() => updateState(), []);

    return (
      <Variant>
        <div style={{ position: 'relative', height: 400, width: 400, border: '1px solid black' }}>
          <div style={{ position: 'absolute', zIndex: 10, pointerEvents: 'none' }} ref={overlayRef} />
          <Canvas>
            {overlayRef.current && ReactDOM.createPortal(<CanvasControls />, overlayRef.current)}
            <div style={{ position: 'absolute', top: 40, left: 40, height: 40, width: 40, background: 'red' }} />
            <div style={{ position: 'absolute', top: 280, left: 120, height: 10, width: 30, background: 'blue' }} />
            <div style={{ position: 'absolute', top: 140, left: 300, height: 60, width: 60, borderRadius: '50%', background: 'yellow' }} />
          </Canvas>
        </div>
      </Variant>
    );
  })
);
