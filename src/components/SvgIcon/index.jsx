// eslint-disable-next-line import/no-extraneous-dependencies
import _isString from 'lodash/isString';
import PropTypes from 'prop-types';
import React from 'react';

import { css, styled } from '@/hocs';
import { Spin } from '@/styles/animations/Spin';
import * as ICONS from '@/svgs';
import { compose } from '@/utils/functional';

export const SvgIconContainer = styled.span`
  ${({ theme, transition }) => transition && theme.transition(...(_isString(transition) ? [transition] : transition))}

  color: ${({ color }) => color};
  width: ${({ size, width = size }) => width}px;
  height: ${({ size, height = size }) => height}px;
  box-sizing: content-box;
  
  ${({ spin }) =>
    spin &&
    css`
      display: block;
      ${Spin}
    `}

  & > svg {
    display: block;
    width: inherit;
    height: inherit;

  }

  &:hover,
  &:active {
    color: ${({ hoverColor, color }) => hoverColor || color};

  }
`;

const SvgIcon = compose(
  React.memo,
  React.forwardRef
)(({ icon, size = 16, color = 'currentColor', checked, ...props }, ref) => {
  let IconElement;

  if (_isString(icon)) {
    if (!(icon in ICONS)) return null;

    IconElement = ICONS[icon];
  } else {
    IconElement = icon;
  }

  return (
    <SvgIconContainer size={size} color={color} checked={checked} {...props} ref={ref}>
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
  transition: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

export default SvgIcon;
