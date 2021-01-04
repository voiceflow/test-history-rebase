import { DeviceConfig, DeviceType, devices } from '@voiceflow/apl-renderer';
import React from 'react';
import { Tooltip } from 'react-tippy';
import { Alert } from 'reactstrap';

import { BaseRenderer } from './components';
import { BaseRendererAPI } from './components/BaseRenderer';

const CONTAINER_WIDTH = 455;

type DisplayRendererProps = {
  apl: string;
  data?: string;
  commands?: string;
  withControls?: boolean;
};

type DisplayRendererState = {
  device: DeviceType;
  height: number;
  scale: number;
  error: Error | null;
};

class DisplayRenderer extends React.Component<DisplayRendererProps, DisplayRendererState> {
  static defaultProps: Partial<DisplayRendererProps> = {
    data: '{}',
    commands: '[]',
    withControls: true,
  };

  state: DisplayRendererState = {
    device: 'medHub',
    height: 266,
    scale: 0.44,
    error: null,
  };

  rendererRef = React.createRef<BaseRendererAPI>();

  device = new DeviceConfig(devices.medHub);

  setError = (error: Error) => this.setState({ error });

  changeDevice = async (device: DeviceType) => {
    this.device = new DeviceConfig(devices[device]);
    const renderer = this.rendererRef.current;

    renderer?.setDeviceConfiguration(this.device);
    await renderer?.renderPreview();

    let scale = Math.min(CONTAINER_WIDTH / this.device.getDpWidth(), 1);
    if (device === 'smallHub') {
      scale = 0.3;
    }
    this.setState({ height: this.device.getDpHeight() * scale, scale, device });
  };

  render() {
    if (this.state.error) {
      return (
        <Alert color="danger" className="mb-0">
          Invalid APL or datasource or commands
          <hr />
          {this.state.error.toString()}
        </Alert>
      );
    }

    return (
      <>
        <div style={{ height: `${this.state.height}px`, overflow: 'hidden' }}>
          <BaseRenderer
            apl={this.props.apl}
            data={this.props.data!}
            commands={this.props.commands!}
            scale={this.state.scale}
            onFail={this.setError}
            ref={this.rendererRef}
          />
        </div>
        {this.props.withControls && (
          <div className="d-flex justify-content-center pt-2">
            {Object.values(devices).map((device) => (
              <Tooltip title={device.name} position="bottom" animation="fade" arrow key={device.id}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
                <div
                  className={device.id === this.state.device ? 'svg-active' : ''}
                  // eslint-disable-next-line xss/no-mixed-html
                  dangerouslySetInnerHTML={{ __html: device.svgIcon }}
                  onClick={() => this.changeDevice(device.id)}
                />
              </Tooltip>
            ))}
          </div>
        )}
      </>
    );
  }
}

export default DisplayRenderer;
