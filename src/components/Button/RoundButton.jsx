import SvgIcon from 'components/SvgIcon';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';

const Button = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: auto;
  border: ${({ type }) => (type === 'plain' ? '1px solid #e2e9ec' : '1px solid #fff')};
  border-radius: 50%;
  text-align: center;
  padding: 0;
  transition: all 0.15s linear;
  box-shadow: ${({ type }) => type !== 'plain' && '0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.18)'};
  width: ${({ width }) => `${width}px` || '15px'};
  height: ${({ height }) => `${height}px` || '15px'};
  color: ${({ color }) => color || '#8da2b5'};
  background-image: ${({ color }) => (color ? `linear-gradient(${color}15, ${color}30)` : 'none')};

  &:hover {
    background-color: ${({ color }) => color}15;
    border-style: double;
    box-shadow: ${({ type }) => (type !== 'plain' ? '0 0 0 1px #fff, 0 2px 4px 1px rgba(17, 49, 96, 0.16)' : 'none')};
    ${({ type }) =>
      type !== 'color' &&
      css`
        color: #6e849a;
      `}
  }

  &:active {
    ${({ type }) => {
      if (type !== 'plain') {
        return css`border: 1px solid #fff !important;
        -webkit-box-shadow: 0 0 0 1px rgba(184, 218, 255, 1);
        -moz-box-shadow: 0 0 0 1px rgba(184, 218, 255, 1);
        background-color: ${({ type }) => (type === 'shadow' ? '#5b9dfa30' : 'initial')}
        color: ${({ type }) => (type === 'shadow' ? '#5b9dfa' : 'initial')}
        box-shadow: ${({ color, type }) => {
          if (color) {
            return `0 0 0 1px ${color}99`;
          }
          if (type === 'shadow') {
            return '0 0 0 1px 5b9dfa99';
          }
          return '0 0 0 1px #fff, 0 2px 4px 1px rgba(17, 49, 96, 0.16)';
        }}`;
      }
      return css`
        background-color: #eef4f6cc;
        color: #113160;
      `;
    }}
  }
`;

const RoundButton = (props) => {
  const { icon, color, imgSize, className, innerRef, onClick, disabled, ...attributes } = props;

  const onBtnClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <Button {...props} {...attributes} className={className} ref={innerRef} onClick={onBtnClick}>
      <SvgIcon icon={icon} width={imgSize} height={imgSize} color={color} />
    </Button>
  );
};

RoundButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.boolean,
  onClick: PropTypes.func,
  type: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  icon: PropTypes.elementType,
  imgSize: PropTypes.number,
  color: PropTypes.string,
};

RoundButton.defaultProps = {
  type: 'plain',
  imgSize: 18,
  width: 42,
  height: 42,
  disabled: false,
};

export default RoundButton;
