// eslint-disable-next-line import/no-extraneous-dependencies
import _isString from 'lodash/isString';
import PropTypes from 'prop-types';
import React from 'react';

import { css, styled, withTheme } from '@/hocs';
import { Spin } from '@/styles/animations/Spin';
import * as ICONS from '@/svgs';
import { compose } from '@/utils/functional';

export const SvgIconContainer = styled.span`
  ${({ theme, transition }) => transition && theme.transition(...(_isString(transition) ? [transition] : transition))}
  box-sizing: content-box;
  width: ${({ size, width = size }) => width}px;
  height: ${({ size, height = size }) => height}px;
  color: ${({ color }) => color};
  opacity: 0.8;

  ${({ spin }) =>
    spin &&
    css`
      display: block;
      ${Spin}
    `}

  ${({ ignoreEvents }) =>
    ignoreEvents &&
    css`
      pointer-events: none;
    `}

  & > svg {
    display: block;
    width: inherit;
    height: inherit;
  }

  &:hover {
    color: ${({ hoverColor, color }) => hoverColor || color};
    opacity: 1;
  }

  &:active {
    color: ${({ activeColor, hoverColor, color }) => activeColor || hoverColor || color};
    opacity: 1;
  }
`;

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
    <SvgIconContainer size={size} color={color} {...iconColors} {...props} ref={ref}>
      <IconElement />
    </SvgIconContainer>
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
