import cn from 'classnames';
import _isString from 'lodash/isString';
import React from 'react';

import { IS_TEST } from '@/config';
import { ClassName } from '@/styles/constants';
import * as ICONS from '@/svgs';
import { Icon } from '@/svgs/types';

import { Container } from './components';
import { SvgIconContainerProps } from './components/SvgIconContainer';

export { IconVariant } from '@/constants';

export * from './components';

export { Icon };

export type IconProps = Partial<SvgIconContainerProps> & {
  icon: Icon | React.ComponentType;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  className?: string;
};

const SvgIcon: React.ForwardRefRenderFunction<HTMLSpanElement, IconProps> = (
  { icon, size = 16, color = 'currentColor', className, ...props },
  ref
) => {
  let IconElement: React.ComponentType;

  if (_isString(icon)) {
    if (!(icon in ICONS)) {
      return null;
    }

    IconElement = ICONS[icon];

    if (IS_TEST && !IconElement) {
      IconElement = () => <svg data-icon-name={icon}></svg>; // eslint-disable-line react/display-name
    }
  } else {
    IconElement = icon;
  }

  return (
    <Container className={cn(ClassName.SVG_ICON, `${ClassName.SVG_ICON}--${icon}`, className)} size={size} color={color} {...props} ref={ref}>
      <IconElement />
    </Container>
  );
};

export default React.memo(React.forwardRef(SvgIcon));
