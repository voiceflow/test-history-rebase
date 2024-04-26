import { changeColorShade } from '@ui/utils/colors';

import * as C from './link.constant';
import * as E from './link.enum';
import type * as I from './link.interface';
import type * as S from './link.style';

export const formatHref = (href: string | undefined, target: string) =>
  target !== '_blank' || !href || !!href.match(C.PROTOCOL_POSTFIX_REGEXP) ? href : `//${href}`;

export const isBuiltInColor = (color: E.Color | string): color is E.Color => C.BUILT_IN_COLORS.has(color);

export const getStateColors = ($color: E.Color | string) => {
  const $hoverColor = isBuiltInColor($color) ? C.ACTIVE_COLOR_MAP[$color] : changeColorShade($color, -40);
  const $activeColor = isBuiltInColor($color) ? C.ACTIVE_COLOR_MAP[$color] : changeColorShade($color, -60);

  return {
    $color,
    $hoverColor,
    $activeColor,
  };
};

export const propsToStyled = <P extends I.BaseProps>({
  color = E.Color.DEFAULT,
  active = false,
  disabled = false,
  textDecoration = false,
  ...props
}: P): S.BaseStyleProps => ({
  ...props,
  ...getStateColors(color),
  $active: active,
  $disabled: disabled,
  $textDecoration: textDecoration,
});
