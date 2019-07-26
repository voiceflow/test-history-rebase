import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';

import SvgIcon from '@/components/SvgIcon';
import { clickableStyles } from '@/componentsV2/Button/styles';

const activeStyles = css`
  background-color: #eef4f6cc;
  color: #113160;

  ${({ variant, color }) =>
    variant !== 'plain' &&
    css`
      border: 1px solid #fff;
      box-shadow: 0 0 0 1px #fff, 0 2px 4px 1px rgba(17, 49, 96, 0.16);

      ${variant === 'shadow' &&
        css`
          background-color: #5b9dfa30;
          color: #5b9dfa;
          box-shadow: 0 0 0 1px 5b9dfa99;
        `}

      ${color &&
        css`
          box-shadow: 0 0 0 1px ${color}99;
        `}
    `}
`;

const hoverStyles = css`
  background-color: ${({ color }) => color}15;
  border-style: double;
  ${({ variant }) => {
    if (variant === 'color') {
      return css`
        box-shadow: 0 0 0 1px #fff, 0 2px 4px 1px rgba(17, 49, 96, 0.16);
      `;
    }
    if (variant === 'shadow') {
      return css`
        box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 6px 0 rgba(17, 49, 96, 0.24);
      `;
    }
  }};
  ${({ variant }) => {
    if (variant !== 'color') {
      return css`
        color: #6e849a;
      `;
    }
  }}
`;

const Button = styled.button`
  ${clickableStyles}
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1;
  background: ${({ color }) => (color ? `linear-gradient(${color}15, ${color}30)` : '#fff')};
  border: ${({ variant }) => (variant === 'plain' ? '1px solid #e2e9ec' : '1px solid #fff')};
  border-radius: 50%;
  text-align: center;
  padding: 0;
  transition: all 0.15s linear;
  ${({ variant }) => {
    if (variant === 'color') {
      return css`
        box-shadow: 0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.18);
      `;
    }
    if (variant === 'shadow') {
      return css`
        box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);
      `;
    }
  }};
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
  `}
  color: ${({ color }) => color || '#8da2b5'};
  background-image: ${({ color }) => (color ? `linear-gradient(${color}15, ${color}30)` : 'none')};

  &:hover {
    ${({ active }) => !active && hoverStyles}
  }
  ${({ active }) => active && activeStyles}
  &:active {
    ${activeStyles}
  }
`;

const RoundButton = (props) => {
  const { icon, color, imgSize, className, innerRef, onClick, disabled } = props;

  return (
    <Button {...props} className={className} ref={innerRef} disabled={disabled} onClick={(e) => onClick(e)}>
      <SvgIcon icon={icon} width={imgSize} height={imgSize} color={color} />
    </Button>
  );
};

RoundButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  icon: PropTypes.elementType,
  imgSize: PropTypes.number,
  color: PropTypes.string,
};

RoundButton.defaultProps = {
  variant: 'plain',
  imgSize: 18,
  size: 42,
  disabled: false,
  onClick: _.noop,
};

export default RoundButton;
