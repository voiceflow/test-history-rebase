import React from 'react';
import { Tooltip, TooltipProps } from 'react-tippy';

import { IS_TEST } from '../../config';
import { ClassName } from '../../styles/constants';
import { HotkeyLabel } from './components';

export interface TippyTooltipProps extends TooltipProps {
  hotkey?: string;
}

const TippyTooltip: React.ForwardRefRenderFunction<Tooltip, React.PropsWithChildren<TippyTooltipProps>> = (
  { html, title, disabled, children, hotkey, ...props },
  ref
) => {
  const withHotkey = !!hotkey;

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <Tooltip
      className={ClassName.TOOLTIP}
      ref={ref}
      html={
        withHotkey ? (
          <>
            {html || title}
            <HotkeyLabel>{hotkey}</HotkeyLabel>
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
