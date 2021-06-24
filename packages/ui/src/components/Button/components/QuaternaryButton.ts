import { css, styled } from '../../../styles';
import ButtonContainer from './ButtonContainer';

const QuaternaryButton = styled(ButtonContainer)`
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 8px 22px 10px;
  color: #5d9df5;
  font-weight: 600;
  background-color: #fff;
  background-image: linear-gradient(-180deg, #5d9df515 0%, #5d9df520 78%);
  border: 0;
  border-radius: 41px;
  box-shadow: none;
  transition: all 0.15s ease-out;

  &:hover {
    background-color: #5d9df510;
  }

  &:active {
    background-color: #5d9df520;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      background: transparent !important;
      opacity: 0.5;
    `}
`;

export default QuaternaryButton;
