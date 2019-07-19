// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import * as React from 'react';
import styled, { css } from 'styled-components';

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

function SvgIcon({ icon: Icon, ...props }) {
  return (
    <SvgIconContainer {...props}>
      <Icon />
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
