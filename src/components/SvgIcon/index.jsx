// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import * as React from 'react';
import styled, { css } from 'styled-components';

export const SvgIconContainer = styled.span`
  display: inline-block;
  color: ${({ color }) => color};

  ${({ size }) => css`
    height: ${size}px;
    width: ${size}px;
  `};

  & > svg {
    display: block;
  }

  &:hover {
    color: ${({ hoverColor }) => hoverColor};
  }
`;

function SvgIcon({ icon: Icon, ...props }) {
  return (
    <SvgIconContainer {...props}>
      <Icon key="Icon" />
    </SvgIconContainer>
  );
}

SvgIcon.propTypes = {
  icon: PropTypes.elementType,
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

SvgIcon.defaultProps = {
  size: 16,
  color: '#6E849A',
};

export default SvgIcon;
