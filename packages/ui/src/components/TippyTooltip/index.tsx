import { IS_TEST } from '@ui/config';
import { ClassName } from '@ui/styles/constants';
import { StringifyEnum } from '@voiceflow/common';
import React from 'react';
import { Theme, Tooltip, TooltipProps } from 'react-tippy';

import { HotkeyLabel } from './components';

export enum TooltipTheme {
  WARNING = 'warning',
  DARK = 'dark',
  LIGHT = 'light',
  TRANSPARENT = 'transparent',
}

export interface TippyTooltipProps extends Omit<TooltipProps, 'theme'> {
  hotkey?: string;
  tag?: string;
  theme?: StringifyEnum<TooltipTheme>;
}

const TippyTooltip: React.ForwardRefRenderFunction<Tooltip, React.PropsWithChildren<TippyTooltipProps>> = (
  { html, title, disabled, children, hotkey, theme, ...props },
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
      theme={theme as Theme}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default React.forwardRef(TippyTooltip);
