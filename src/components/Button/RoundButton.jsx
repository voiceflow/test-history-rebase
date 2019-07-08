import React from 'react';
import styled from 'styled-components';

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
    color: ${({ type }) => (type === 'plain' ? '#979797' : 'initial')};
  }

  &:active {
    ${({ type }) => {
      if (type !== 'plain') {
        return `border: 1px solid #fff !important;
        -webkit-box-shadow: 0 0 0 1px rgba(184, 218, 255, 1);
        -moz-box-shadow: 0 0 0 1px rgba(184, 218, 255, 1);
        box-shadow: ${({ color, type }) => {
          if (color) {
            return `0 0 0 1px ${color}99`;
          }
          if (type === 'shadow') {
            return '0 0 0 1px 5b9dfa99';
          }
          return '0 0 0 1px #fff, 0 2px 4px 1px rgba(17, 49, 96, 0.16)';
        }};
        background-color: ${({ type }) => (type === 'shadow' ? '#5b9dfa30' : 'initial')};`;
      }
      return `background-color: #DFE3ED;
          color: #113160;`;
    }}
  }
`;

const RoundButton = (props) => {
  const { icon, imgAlt, imgSize, className, innerRef, onClick, disabled, ...attributes } = props;

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
      <img src={icon} alt={imgAlt || 'button'} width={imgSize || 18} height={imgSize || 18} />
    </Button>
  );
};

export default RoundButton;
