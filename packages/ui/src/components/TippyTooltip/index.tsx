import { IS_TEST } from '@ui/config';
import { ClassName } from '@ui/styles/constants';
import { StringifyEnum } from '@voiceflow/common';
import React from 'react';
import { Theme, Tooltip, TooltipProps } from 'react-tippy';

import { Complex, FooterButton, HotkeyLabel, Multiline, Title } from './components';

export enum TooltipTheme {
  DARK = 'dark',
  LIGHT = 'light',
  WARNING = 'warning',
  TRANSPARENT = 'transparent',
}

export interface TippyTooltipProps extends Omit<TooltipProps, 'theme'> {
  tag?: string;
  theme?: StringifyEnum<TooltipTheme>;
  hotkey?: string;
  bodyOverflow?: boolean;
}

const TippyTooltip: React.ForwardRefRenderFunction<Tooltip, React.PropsWithChildren<TippyTooltipProps>> = (
  { html, title, theme, disabled, children, hotkey, popperOptions, bodyOverflow, ...props },
  ref
) => {
  const withHotkey = !!hotkey;

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <Tooltip
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
      theme={theme as Theme}
      disabled={disabled || IS_TEST}
      className={ClassName.TOOLTIP}
      popperOptions={{
        ...popperOptions,
        modifiers: bodyOverflow
          ? { preventOverflow: { enabled: true, boundariesElement: document.body, padding: 16 }, ...popperOptions?.modifiers }
          : popperOptions?.modifiers,
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default Object.assign(React.forwardRef(TippyTooltip), {
  Title,
  Multiline,
  Complex,
  HotkeyLabel,
  FooterButton,
});
