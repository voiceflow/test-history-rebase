import './DisplayRender.css';

import { DeviceConfig, createRenderer, devices } from '@voiceflow/apl-renderer';
import _ from 'lodash';
import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';
import { Alert } from 'reactstrap';

class DisplayRender extends Component {
  state = {
    device: 'medHub',
    height: 450,
    scale: 'scale(0.75)',
    error: null,
  };

  elem = React.createRef();

  device = new DeviceConfig(devices.medHub);

  async componentDidMount() {
    this.renderer = createRenderer(this.device, this.elem.current, { sendCommandEvent: _.constant(0), sendActivityEvent: _.constant(0) });
    try {
      await this.renderer.render(JSON.parse(this.props.apl), JSON.parse(this.props.data || '{}'), {});
      await this.renderer.executeCommands(JSON.parse(this.props.commands || '[]'));
    } catch (err) {
      this.setError(err);
    }
  }

  setError = (error) => this.setState({ error });

  changeDevice = async (device) => {
    this.device = new DeviceConfig(devices[device]);
    this.renderer.setDeviceConfiguration(this.device);
    try {
      await this.renderer.render(JSON.parse(this.props.apl), JSON.parse(this.props.data), {});
      await this.renderer.executeCommands(JSON.parse(this.props.commands || '[]'));
    } catch (err) {
      this.setError(err);
    }
    const scale = Math.min(768 / this.device.getDpWidth(), 1);
    this.setState({ height: this.device.getDpHeight() * scale, scale: `scale(${scale})`, device });
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
      <div>
        <div style={{ height: `${this.state.height}px`, overflow: 'hidden' }}>
          <div className="display-elem" ref={this.elem} style={{ transform: this.state.scale }} />
        </div>
        <div className="d-flex justify-content-center pt-2">
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
