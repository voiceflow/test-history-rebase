import { css, styled } from '../../../styles';
import ButtonContainer from './ButtonContainer';

const TertiaryButton = styled(ButtonContainer)`
  padding: 0 22px;
  color: #5d9df5;
  font-weight: 600;
  border: 0;
  box-shadow: none;
  transition: all 0.15s ease-out;

  ${({ disabled }) =>
    disabled
      ? css`
          color: rgba(93, 157, 245, 0.5);
          pointer-events: none;
        `
      : css`
          &:hover {
            background: rgba(93, 157, 245, 0.1);
          }
        `}

  &:active {
    background: rgba(93, 157, 245, 0.16);
  }
`;

export default TertiaryButton;
