// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';

import * as ICONS from '@/svgs';

export const SvgIconContainer = styled.span`
  color: ${({ color }) => color};

  & > svg {
    display: block;

    ${({ size, height = size, width = size }) => css`
      height: ${height}px;
      width: ${width}px;
    `};
  }

  &:hover {
    color: ${({ hoverColor, color }) => hoverColor || color};
  }
`;

function SvgIcon({ icon, ...props }) {
  let IconElement;
  if (_.isString(icon)) {
    if (!(icon in ICONS)) return null;
    IconElement = ICONS[icon];
  } else {
    IconElement = icon;
  }

  return (
    <SvgIconContainer {...props}>
      <IconElement />
    </SvgIconContainer>
  );
}

SvgIcon.propTypes = {
  icon: PropTypes.elementType,
  size: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

SvgIcon.defaultProps = {
  size: 16,
  color: '#6E849A',
};

export default SvgIcon;
