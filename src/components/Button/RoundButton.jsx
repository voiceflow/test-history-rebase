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
  border: 1px solid #fff;
  border-radius: 50%;
  text-align: center;
  padding: 0;
  box-shadow: ${(props) => props.type !== 'plain' && '0 0 0 1px #fff, 0 1px 2px 1px rgba(17, 49, 96, 0.18)'};
  width: ${(props) => `${props.width}px` || '15px'};
  height: ${(props) => `${props.height}px` || '15px'};
  color: ${(props) => props.color || '#8da2b5'};
  background-image: ${(props) => (props.color ? `linear-gradient(${props.color}15, ${props.color}30)` : 'none')};

  &:hover {
    background-color: ${(props) => props.color}15;
    border-style: double;
    box-shadow: 0 0 0 1px #fff, 0 2px 4px 1px rgba(17, 49, 96, 0.16);
  }

  &:active {
    border: 1px solid #fff !important;
    -webkit-box-shadow: 0 0 0 1px rgba(184, 218, 255, 1);
    -moz-box-shadow: 0 0 0 1px rgba(184, 218, 255, 1);
    box-shadow: ${(props) => {
      if (props.color) {
        return `0 0 0 1px ${props.color}99`;
      }
      if (props.type === 'shadow') {
        return '0 0 0 1px 5b9dfa99';
      }
      return '0 0 0 1px #fff, 0 2px 4px 1px rgba(17, 49, 96, 0.16';
    }};
    background-color: ${(props) => (props.type === 'shadow' ? '#5b9dfa30' : 'initial')};
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
