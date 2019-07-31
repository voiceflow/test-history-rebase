import { storiesOf } from '@storybook/react';
import React from 'react';
import ReactDOM from 'react-dom';

import CanvasControls from '@/components/CanvasControls';

import Canvas from '.';

// only needed because hooks unavailavle in storybook
class CanvasExample extends React.PureComponent {
  overlayRef = React.createRef();

  componentDidMount() {
    this.forceUpdate();
  }

  render() {
    return (
      <div style={{ position: 'relative', height: 400, width: 400, border: '1px solid black' }}>
        <div style={{ position: 'absolute', zIndex: 10 }} ref={this.overlayRef} />
        <Canvas>
          {this.overlayRef.current && ReactDOM.createPortal(<CanvasControls />, this.overlayRef.current)}
          <div style={{ position: 'absolute', top: 40, left: 40, height: 40, width: 40, background: 'red' }} />
          <div style={{ position: 'absolute', top: 280, left: 120, height: 10, width: 30, background: 'blue' }} />
          <div style={{ position: 'absolute', top: 140, left: 300, height: 60, width: 60, borderRadius: '50%', background: 'yellow' }} />
        </Canvas>
      </div>
    );
  }
}

storiesOf('Canvas', module).add('variants', () => {
  return <CanvasExample />;
});
