import _isString from 'lodash/isString';
import PropTypes from 'prop-types';
import React from 'react';

import { withTheme } from '@/hocs';
import * as ICONS from '@/svgs';
import { compose } from '@/utils/functional';

import { Container } from './components';

export * from './components';

const SvgIcon = compose(
  React.memo,
  React.forwardRef
)(({ icon, size = 16, color = 'currentColor', variant, theme, ...props }, ref) => {
  let IconElement;

  if (_isString(icon)) {
    if (!(icon in ICONS)) return null;

    IconElement = ICONS[icon];
  } else {
    IconElement = icon;
  }

  const iconColors = theme.components.icon[variant];

  return (
    <Container size={size} color={color} variant={variant} {...iconColors} {...props} ref={ref}>
      <IconElement />
    </Container>
  );
});

SvgIcon.propTypes = {
  icon: PropTypes.elementType,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.number,
  color: PropTypes.string,
  height: PropTypes.number,
  className: PropTypes.string,
  transition: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

export default withTheme(SvgIcon);
