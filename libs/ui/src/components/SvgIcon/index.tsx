import { IS_TEST } from '@ui/config';
import { ClassName } from '@ui/styles/constants';
import * as ICONS from '@ui/svgs';
import cn from 'classnames';
import React from 'react';

import { Variant } from './constants';
import * as S from './styles';
import type * as T from './types';

export * as SvgIconTypes from './types';

const SvgIcon = React.forwardRef<HTMLSpanElement, T.Props>(
  ({ icon, size = 16, color = 'currentColor', className, ...props }, ref) => {
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
      <S.Container
        className={cn(ClassName.SVG_ICON, `${ClassName.SVG_ICON}--${icon}`, className)}
        size={size}
        color={color}
        {...props}
        ref={ref}
      >
        <IconElement />
      </S.Container>
    );
  }
);

export default Object.assign(React.memo(SvgIcon), {
  ICONS,
  Variant,
  DEFAULT_COLOR: '#6E849A',
  Container: S.Container,
});
