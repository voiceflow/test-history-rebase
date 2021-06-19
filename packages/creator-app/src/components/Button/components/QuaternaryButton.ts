import ButtonContainer from '@/components/Button/components/ButtonContainer';
import { css, styled } from '@/hocs';

const QuaternaryButton = styled(ButtonContainer)`
  border: 0;
  padding: 8px 22px 10px;
  font-weight: 600;
  box-shadow: none;
  transition: all 0.15s ease-out;
  display: inline-block;
  background-color: #fff;
  border-radius: 41px;
  color: #5d9df5;
  position: relative;
  z-index: 1;
  background-image: linear-gradient(-180deg, #5d9df515 0%, #5d9df520 78%);
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
