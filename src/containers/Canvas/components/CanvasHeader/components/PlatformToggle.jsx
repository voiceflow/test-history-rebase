import cn from 'classnames';
import React from 'react';
import { Tooltip } from 'react-tippy';

const GOOGLE_PLATFORM = 'google';
const ALEXA_PLATFORM = 'alexa';

function PlatformToggle({ platform, onToggle }) {
  return (
    <div id="middle-group">
      <Tooltip
        distance={16}
        title={platform === GOOGLE_PLATFORM ? 'Switch to Amazon View' : 'Switch to Google View'}
        position="bottom"
        className="switch switch-blue"
        tag="div"
      >
        <input
          onClick={() => platform !== ALEXA_PLATFORM && onToggle()}
          type="radio"
          className={cn('switch-input', { checked: platform === ALEXA_PLATFORM })}
          value="alexa_toggle"
          id="alexa_toggle"
        />
        <label className="switch-label switch-label-on mt-2" htmlFor="alexa_toggle">
          Alexa
        </label>
        <input
          onClick={() => platform !== GOOGLE_PLATFORM && onToggle()}
          type="radio"
          className={cn('switch-input', { checked: platform === GOOGLE_PLATFORM })}
          value="google_toggle"
          id="google_toggle"
        />
        <label className="switch-label switch-label-off mt-2" htmlFor="google_toggle">
          Google
        </label>
        <span className="switch-selection" />
      </Tooltip>
    </div>
  );
}

export default PlatformToggle;
