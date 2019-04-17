import React from 'react';
import cn from 'classnames'
import {Tooltip} from 'react-tippy';

const PlatformTooltip = ({ field, platform }) => (
  <Tooltip
    target="tooltip"
    className="menu-tip align-self-center"
    theme="menu"
    position="left"
    title={`${field} are platform-specific. You are currently on ${platform === 'google' ? 'Google' : 'Alexa'}`}
  >
    <i className={cn('fab', {
      'fa-google': platform === 'google',
      'fa-amazon': platform !== 'google'
    })} id="tooltip" />
  </Tooltip>
)

export default PlatformTooltip;


