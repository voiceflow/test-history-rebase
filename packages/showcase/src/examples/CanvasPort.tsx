import { Canvas } from '@voiceflow/ui';
import React from 'react';

import { withBoxFlexCenter } from './hocs';
import { createExample, createSection } from './utils';

const wrapContainer = withBoxFlexCenter({ width: 80, height: 80, backgroundColor: '#fff' });

export default createSection('Canvas.Port', 'src/components/Canvas/components/Port.ts', [
  createExample(
    'unconnected port',
    wrapContainer(() => <Canvas.Port />)
  ),

  createExample(
    'unconnected flat port',
    wrapContainer(() => <Canvas.Port flat />)
  ),

  createExample(
    'unconnected highlighted port',
    wrapContainer(() => <Canvas.Port highlighted />)
  ),

  createExample(
    'unconnected flat highlighted port',
    wrapContainer(() => <Canvas.Port flat highlighted />)
  ),

  createExample(
    'connected port',
    wrapContainer(() => <Canvas.Port connected />)
  ),

  createExample(
    'connected flat port',
    wrapContainer(() => <Canvas.Port flat connected />)
  ),

  createExample(
    'interactive',
    wrapContainer(() => {
      const [connected, setConnected] = React.useState(false);
      const [highlighted, setHighlighted] = React.useState(false);

      return (
        <Canvas.Port
          onClick={() => setConnected(!connected)}
          onMouseUp={() => setHighlighted(false)}
          connected={connected}
          highlighted={!connected && highlighted}
          onMouseDown={() => !connected && setHighlighted(true)}
        />
      );
    })
  ),
]);
