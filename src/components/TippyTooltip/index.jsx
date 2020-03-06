import React from 'react';
import { Tooltip } from 'react-tippy';

import { IS_TEST, isMac } from '@/config';

import { HotkeyLabel } from './components';

const TippyTooltip = ({ html, title, disabled, children, hotkey, systemHotkey, ...props }, ref) => {
  const withHotkey = !!(hotkey || systemHotkey);

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <Tooltip
      ref={ref}
      html={
        withHotkey ? (
          <>
            {html || title}
            <HotkeyLabel>{systemHotkey ? `${isMac ? '⌘' : 'Ctrl+'}${systemHotkey}` : hotkey}</HotkeyLabel>
          </>
        ) : (
          html
        )
      }
      title={withHotkey ? null : title}
      disabled={disabled || IS_TEST}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default React.forwardRef(TippyTooltip);
