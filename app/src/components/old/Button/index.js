import styled, { css } from 'styled-components';

const buttonStyles = css`
  height: 35px;
  width: 115px;
  text-decoration: none;
  color: white;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  background: #5c9cf5;
  opacity: ${props => (props.disabled ? 0.2 : 1)};
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  font-size: 16px;
  border-radius: 3px;
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};
  -webkit-appearance: none !important;
  font-family: Lato;

  &:hover {
    background: #5296f4;
  }

  &:active {
    background: #3a87f2;
    box-shadow: 0 0 0 2px rgba(92, 156, 245, 0.5);
  }

  span.isvg {
    margin-right: 9px;
  }
`;

const Button = styled.button`
  ${buttonStyles};
`;

const LabelButton = styled.label`
  ${buttonStyles};
`;

export { LabelButton };

export default Button;
