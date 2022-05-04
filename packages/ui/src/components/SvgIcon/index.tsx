import { IS_TEST } from '@ui/config';
import { IconVariant } from '@ui/constants';
import { ClassName } from '@ui/styles/constants';
import * as ICONS from '@ui/svgs';
import cn from 'classnames';
import React from 'react';

import { SvgIconContainer } from './components';
import { SvgIconContainerProps } from './components/SvgIconContainer';

export * from './components';
export { IconVariant } from '@ui/constants';

export type Icon = keyof typeof ICONS;

export interface SvgIconProps extends Partial<SvgIconContainerProps> {
  id?: string;
  icon: Icon | React.ComponentType;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  className?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
}

const SvgIcon: React.ForwardRefRenderFunction<HTMLSpanElement, SvgIconProps> = (
  { icon, size = 16, color = 'currentColor', className, ...props },
  ref
) => {
  let IconElement: React.ComponentType;

  if (typeof icon === 'string') {
    if (!(icon in ICONS)) {
      return null;
    }

    IconElement = ICONS[icon];

    if (IS_TEST && !IconElement) {
      IconElement = () => <svg data-icon-name={icon}></svg>;
    }
  } else {
    IconElement = icon;
  }

  return (
    <SvgIconContainer className={cn(ClassName.SVG_ICON, `${ClassName.SVG_ICON}--${icon}`, className)} size={size} color={color} {...props} ref={ref}>
      <IconElement />
    </SvgIconContainer>
  );
};

export default Object.assign(React.memo(React.forwardRef(SvgIcon)), {
  ICONS,
  Variant: IconVariant,

  Container: SvgIconContainer,
});
