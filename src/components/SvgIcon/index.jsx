// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import * as React from 'react';
import styled, { css } from 'styled-components';

export const SvgIconContainer = styled.span`
  display: inline-block;
  color: ${({ color }) => color};

  ${({ height, width }) => css`
    height: ${height}px;
    width: ${width}px;
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
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

SvgIcon.defaultProps = {
  height: 16,
  width: 16,
  color: '#6E849A',
};

export default SvgIcon;
