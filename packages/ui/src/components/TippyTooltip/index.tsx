import composeRef from '@seznam/compose-react-refs';
import { IS_TEST } from '@ui/config';
import { useCreateConst, useTeardown } from '@ui/hooks';
import { ClassName } from '@ui/styles/constants';
import { StringifyEnum, Utils } from '@voiceflow/common';
import React from 'react';
import { Theme, Tooltip, TooltipProps } from 'react-tippy';

import { Complex, FooterButton, HotkeyLabel, HotkeyText, Multiline, Title } from './components';

export enum TooltipTheme {
  DARK = 'dark',
  LIGHT = 'light',
  WARNING = 'warning',
  TRANSPARENT = 'transparent',
}

export interface TippyTooltipProps extends Omit<TooltipProps, 'theme' | 'delay'> {
  tag?: string;
  delay?: number | [number, number];
  theme?: StringifyEnum<TooltipTheme>;
  hotkey?: string;
  bodyOverflow?: boolean;
  distance?: number;
  offset?: number;
  onShow?: () => void;
}

// we need this to store all opened tooltips and manually close them
// f.e. when canvas is zoomed/panned
const OPENED_TOOLTIP_MAP = new Map<string, Tooltip>();

const registerOpenedTooltip = (id: string, tooltip: Tooltip | null) => {
  if (tooltip === null) {
    OPENED_TOOLTIP_MAP.delete(id);
  } else {
    OPENED_TOOLTIP_MAP.set(id, tooltip);
  }
};

const closeAll = () =>
  OPENED_TOOLTIP_MAP.forEach((tooltip) => {
    tooltip.hideTooltip();
  });

const TippyTooltip: React.ForwardRefRenderFunction<Tooltip, React.PropsWithChildren<TippyTooltipProps>> = (
  { html, title, delay, theme, disabled, children, hotkey, popperOptions, bodyOverflow, distance, offset, ...props },
  ref
) => {
  const tooltipRef = React.useRef<Tooltip>(null);
  const internalId = useCreateConst(() => Utils.id.cuid.slug());

  const withHotkey = !!hotkey;

  useTeardown(() => registerOpenedTooltip(internalId, null));

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <Tooltip
      ref={composeRef(ref, tooltipRef)}
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
      // delay types are not correct in the lib
      delay={delay as any}
      theme={theme as Theme}
      disabled={disabled || IS_TEST}
      className={ClassName.TOOLTIP}
      distance={distance}
      offset={offset}
      popperOptions={{
        ...popperOptions,
        modifiers: bodyOverflow
          ? { preventOverflow: { enabled: true, boundariesElement: document.body, padding: 16 }, ...popperOptions?.modifiers }
          : popperOptions?.modifiers,
      }}
      {...props}
      onShow={Utils.functional.chain(props.onShow, () => registerOpenedTooltip(internalId, tooltipRef.current))}
      onHide={Utils.functional.chain(props.onHide, () => registerOpenedTooltip(internalId, null))}
    >
      {children}
    </Tooltip>
  );
};

export default Object.assign(React.forwardRef(TippyTooltip), {
  closeAll,

  Title,
  Complex,
  Multiline,
  HotkeyLabel,
  HotkeyText,
  FooterButton,
});
