import cn from 'classnames';
import React from 'react';
import { Tooltip } from 'react-tippy';

import { PlatformType } from '@/constants';

import PlatformToggleContainer from './PlatformToggleContainer';

function PlatformToggle({ platform, onToggle, disabled }) {
  const toggle = (
    <>
      <input
        onClick={() => platform !== PlatformType.ALEXA && onToggle()}
        type="radio"
        className={cn('switch-input', { checked: platform === PlatformType.ALEXA })}
        value="alexa_toggle"
        id="alexa_toggle"
      />
      <label className="switch-label switch-label-on mt-2" htmlFor="alexa_toggle">
        Alexa
      </label>
      <input
        onClick={() => platform !== PlatformType.GOOGLE && onToggle()}
        type="radio"
        className={cn('switch-input', { checked: platform === PlatformType.GOOGLE })}
        value="google_toggle"
        id="google_toggle"
      />
      <label className="switch-label switch-label-off mt-2" htmlFor="google_toggle">
        Google
      </label>
      <span className="switch-selection" />
    </>
  );

  return (
    <PlatformToggleContainer disabled={disabled}>
      {disabled ? (
        <div className="switch switch-blue">{toggle}</div>
      ) : (
        <Tooltip
          distance={16}
          title={platform === PlatformType.GOOGLE ? 'Switch to Amazon View' : 'Switch to Google View'}
          position="bottom"
          className="switch switch-blue"
          tag="div"
        >
          {toggle}
        </Tooltip>
      )}
    </PlatformToggleContainer>
  );
}

export default PlatformToggle;
