import React from 'react';
import { Tooltip, TooltipProps } from 'react-tippy';

import { IS_MAC, IS_TEST } from '../../config';
import { ClassName } from '../../styles/constants';
import { HotkeyLabel } from './components';

export type TippyTooltipProps = TooltipProps & {
  hotkey?: string;
  systemHotkey?: string;
};

const TippyTooltip: React.ForwardRefRenderFunction<Tooltip, React.PropsWithChildren<TippyTooltipProps>> = (
  { html, title, disabled, children, hotkey, systemHotkey, ...props },
  ref
) => {
  const withHotkey = !!(hotkey || systemHotkey);

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <Tooltip
      className={ClassName.TOOLTIP}
      ref={ref}
      html={
        withHotkey ? (
          <>
            {html || title}
            <HotkeyLabel>{systemHotkey ? `${IS_MAC ? '⌘' : 'Ctrl+'}${systemHotkey}` : hotkey}</HotkeyLabel>
          </>
        ) : (
          html
        )
      }
      title={withHotkey ? undefined : title}
      disabled={disabled || IS_TEST}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default React.forwardRef(TippyTooltip);
