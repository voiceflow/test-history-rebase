import './DisplayRender.css';

import { DeviceConfig, createRenderer, devices } from '@voiceflow/apl-renderer';
import _ from 'lodash';
import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';

class DisplayRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: 'medHub',
      height: 450,
      scale: 'scale(0.75)',
    };
    this.elem = React.createRef();
    this.device = new DeviceConfig(devices.medHub);
    this.changeDevice = this.changeDevice.bind(this);
  }

  async componentDidMount() {
    this.renderer = createRenderer(this.device, this.elem.current, { sendCommandEvent: _.constant(0), sendActivityEvent: _.constant(0) });
    try {
      await this.renderer.render(JSON.parse(this.props.apl), JSON.parse(this.props.data || '{}'), {});
      await this.renderer.executeCommands(JSON.parse(this.props.commands || '[]'));
    } catch (e) {
      this.props.error('Invalid APL or datasource or commands');
    }
  }

  async changeDevice(device) {
    this.device = new DeviceConfig(devices[device]);
    this.renderer.setDeviceConfiguration(this.device);
    try {
      await this.renderer.render(JSON.parse(this.props.apl), JSON.parse(this.props.data), {});
      await this.renderer.executeCommands(JSON.parse(this.props.commands || '[]'));
    } catch (e) {
      this.props.error('Invalid APL or datasource or commands');
    }
    const scale = Math.min(768 / this.device.getDpWidth(), 1);
    this.setState({ height: this.device.getDpHeight() * scale, scale: `scale(${scale})`, device });
  }

  render() {
    return (
      <div>
        <div style={{ height: `${this.state.height}px`, overflow: 'hidden' }}>
          <div className="display-elem" ref={this.elem} style={{ transform: this.state.scale }} />
        </div>
        <div className="d-flex justify-content-center pt-1">
          {_.values(devices).map((d) => {
            return (
              <Tooltip title={d.name} position="bottom" theme="block" animation="fade" arrow key={d.id}>
                <div
                  className={d.id === this.state.device ? 'svg-active' : ''}
                  // eslint-disable-next-line xss/no-mixed-html
                  dangerouslySetInnerHTML={{ __html: d.svgIcon }}
                  onClick={() => this.changeDevice(d.id)}
                />
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  }
}
DisplayRender.defaultProps = {
  data: '{}',
  commands: '[]',
};
export default DisplayRender;
