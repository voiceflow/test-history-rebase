// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';

import * as ICONS from '@/svgs';
import { compose } from '@/utils/functional';

export const SvgIconContainer = styled.span`
  color: ${({ color }) => color};

  & > svg {
    display: block;

    ${({ size, height = size, width = size }) => css`
      height: ${height}px;
      width: ${width}px;
    `};
  }

  &:hover,
  &:active {
    color: ${({ hoverColor, color }) => hoverColor || color};
  }
`;

// eslint-disable-next-line react/display-name
const SvgIcon = compose(
  React.memo,
  React.forwardRef
)(function SvgIcon({ icon, ...props }, ref) {
  let IconElement;
  if (_.isString(icon)) {
    if (!(icon in ICONS)) return null;
    IconElement = ICONS[icon];
  } else {
    IconElement = icon;
  }

  return (
    <SvgIconContainer {...props} ref={ref}>
      <IconElement />
    </SvgIconContainer>
  );
});

SvgIcon.propTypes = {
  icon: PropTypes.elementType,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

SvgIcon.defaultProps = {
  size: 16,
  color: 'currentColor',
};

export default SvgIcon;
