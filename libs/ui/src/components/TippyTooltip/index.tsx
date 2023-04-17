/* eslint-disable import/no-extraneous-dependencies */
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/animations/shift-away.css';

import Tippy, { TippyProps } from '@tippyjs/react';
import { IS_TEST } from '@ui/config';
import { useCreateConst, useTeardown } from '@ui/hooks';
import { ClassName } from '@ui/styles/constants';
import { StringifyEnum, Utils } from '@voiceflow/common';
import cns from 'classnames';
import React from 'react';
import type { Instance } from 'tippy.js';
import { animateFill as animateFillPlugin } from 'tippy.js';

import { Complex, FooterButton, HotkeyLabel, HotkeyText, Multiline, Title, WithHotkey } from './components';
import * as S from './styles';

export enum TooltipTheme {
  DARK = 'dark',
  LIGHT = 'light',
  WARNING = 'warning',
  TRANSPARENT = 'transparent',
}

export interface TippyTooltipProps extends Omit<TippyProps, 'children'>, React.PropsWithChildren {
  tag?: keyof JSX.IntrinsicElements;
  width?: number;
  style?: React.CSSProperties;
  theme?: StringifyEnum<TooltipTheme>;
  display?: React.CSSProperties['display'];

  /**
   * @deprecated use `placement` instead
   */
  position?: TippyProps['placement'];
}

// we need this to store all opened tooltips and manually close them
// f.e. when canvas is zoomed/panned
const OPENED_TOOLTIP_MAP = new Map<string, Instance>();

const registerOpenedTooltip = (id: string, tooltip: Instance | null) => {
  if (tooltip === null) {
    OPENED_TOOLTIP_MAP.delete(id);
  } else {
    OPENED_TOOLTIP_MAP.set(id, tooltip);
  }
};

const closeAll = () => OPENED_TOOLTIP_MAP.forEach((tooltip) => tooltip.hide());

const TippyTooltip = React.forwardRef<Element, TippyTooltipProps>(
  (
    {
      tag: Tag = 'div',
      width,
      style,
      arrow = false,
      onShow,
      onHide,
      display = 'inline',
      plugins,
      disabled,
      children,
      appendTo = document.body,
      position,
      placement,
      animation = 'shift-away',
      className,
      popperOptions,
      duration = [150, 0],
      ...props
    },
    ref
  ) => {
    const internalId = useCreateConst(() => Utils.id.cuid.slug());

    useTeardown(() => registerOpenedTooltip(internalId, null));

    return (
      <Tippy
        {...props}
        ref={ref}
        arrow={arrow}
        onShow={Utils.functional.chain(onShow, (instance) => registerOpenedTooltip(internalId, instance))}
        onHide={Utils.functional.chain(onHide, () => registerOpenedTooltip(internalId, null))}
        plugins={props.animateFill ? [animateFillPlugin, ...(plugins ?? [])] : plugins}
        maxWidth={width}
        appendTo={appendTo}
        disabled={disabled || IS_TEST}
        duration={duration}
        animation={animation}
        placement={placement ?? position}
        popperOptions={{
          ...popperOptions,
          modifiers: [{ name: 'preventOverflow', options: { boundary: document.body, padding: 10 } }, ...(popperOptions?.modifiers ?? [])],
        }}
      >
        <Tag style={{ display, ...style }} className={cns(ClassName.TOOLTIP, className)}>
          {children}
        </Tag>
      </Tippy>
    );
  }
);

export default Object.assign(TippyTooltip, {
  closeAll,

  Title,
  Complex,
  Multiline,
  WithHotkey,
  HotkeyText,
  HotkeyLabel,
  FooterButton,
  GlobalStyles: S.GlobalStyle,
});
