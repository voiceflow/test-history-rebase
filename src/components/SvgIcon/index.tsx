import _isString from 'lodash/isString';
import React from 'react';

import { IS_TEST } from '@/config';
import * as ICONS from '@/svgs';
import { Icon } from '@/svgs/types';

import { Container } from './components';
import { SvgIconContainerProps } from './components/SvgIconContainer';

export * from './components';

export { Icon };

export type IconProps = Partial<SvgIconContainerProps> & {
  icon: Icon | React.ComponentType;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
};

const SvgIcon: React.FC<IconProps> = ({ icon, size = 16, color = 'currentColor', ...props }, ref: React.Ref<HTMLSpanElement>) => {
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
    <Container size={size} color={color} {...props} ref={ref}>
      <IconElement />
    </Container>
  );
};

export default React.memo(React.forwardRef(SvgIcon));
