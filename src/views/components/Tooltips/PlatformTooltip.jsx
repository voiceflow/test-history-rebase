import React, { PureComponent } from 'react';
import {Tooltip} from 'react-tippy';

class PlatformTooltip extends PureComponent {
  render() {
    return (
      <Tooltip
        target="tooltip"
        className="menu-tip align-self-center"
        theme="menu"
        position="left"
        title={`${this.props.field} are platform-specific. You are currently on ${this.props.platform === 'google' ? 'Google' : 'Alexa'}`}
      >
        <i className={`fab ${this.props.platform === 'google' ? 'fa-google' : 'fa-amazon'}`} id="tooltip" />
      </Tooltip>
    )
  }
}

export default PlatformTooltip;


