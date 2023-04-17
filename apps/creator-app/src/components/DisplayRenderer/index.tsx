import { AlexaConstants } from '@voiceflow/alexa-types';
import { Alert, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { APLRendererProps } from '../APLRenderer';
import { BaseRenderer, Container } from './components';

const CONTAINER_WIDTH = 452;
const SMALL_HUB_SCALE = 0.8;

const DEVICES = [
  AlexaConstants.APLDeviceType.SMALL_ROUND_HUB,
  AlexaConstants.APLDeviceType.SMALL_RECT_HUB,
  AlexaConstants.APLDeviceType.MEDIUM_HUB,
  AlexaConstants.APLDeviceType.LARGE_HUB,
  AlexaConstants.APLDeviceType.LARGE_TV,
];

const getDeviceInfo = (type: AlexaConstants.APLDeviceType) => {
  // const device = new DeviceConfig(devices[type]);
  const { height, width, density } = AlexaConstants.APL_DEVICE_CONFIG[type];
  const scale = CONTAINER_WIDTH / width;
  const isSmallHub = type === 'smallHub';

  return {
    viewport: {
      height,
      width,
      dpi: density,
      isRound: isSmallHub,
    },
    device: type,
    scale: isSmallHub ? SMALL_HUB_SCALE : scale,
  };
};

interface DisplayRendererProps {
  apl: string;
  data?: string;
  commands?: string;
  withControls?: boolean;
}

interface DisplayRendererState {
  device: AlexaConstants.APLDeviceType;
  viewport: APLRendererProps['viewport'];
  scale: number;
  error: Error | null;
}

class DisplayRenderer extends React.Component<DisplayRendererProps, DisplayRendererState> {
  static defaultProps: Partial<DisplayRendererProps> = {
    data: '{}',
    commands: '[]',
    withControls: true,
  };

  state: DisplayRendererState = {
    ...getDeviceInfo(AlexaConstants.APLDeviceType.MEDIUM_HUB),
    error: null,
  };

  setError = (error: Error) => this.setState({ error });

  changeDevice = async (device: AlexaConstants.APLDeviceType) => this.setState(getDeviceInfo(device));

  componentDidCatch(error: Error) {
    // for some reason the APLRenderer always throws an error when unmounting
    this.setError(error);
  }

  render() {
    if (this.state.error) {
      return (
        <Alert variant={Alert.Variant.DANGER}>
          Invalid APL or datasource or commands
          <hr />
          {this.state.error.toString()}
        </Alert>
      );
    }

    return (
      <>
        <Container height={this.state.viewport.height * this.state.scale}>
          <BaseRenderer
            apl={this.props.apl}
            data={this.props.data!}
            commands={this.props.commands!}
            viewport={this.state.viewport}
            scale={this.state.scale}
            onFail={this.setError}
          />
        </Container>
        {this.props.withControls && (
          <div className="d-flex justify-content-center pt-2">
            {DEVICES.map((type) => [type, AlexaConstants.APL_DEVICE_CONFIG[type]] as const).map(([type, device]) => (
              <TippyTooltip content={device.name} position="bottom" key={type}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
                <div
                  className={type === this.state.device ? 'svg-active' : ''}
                  // eslint-disable-next-line xss/no-mixed-html
                  dangerouslySetInnerHTML={{ __html: device.svgIcon }}
                  onClick={() => this.changeDevice(type)}
                />
              </TippyTooltip>
            ))}
          </div>
        )}
      </>
    );
  }
}

export default DisplayRenderer;
