import { css, styled, transition } from '../../../../../styles';
import ButtonContainer, { ButtonContainerProps } from '../../ButtonContainer';
import { hoverStyles } from '../styles';
import Icon from './SecondaryButtonIcon';

export interface SecondaryButtonContainerProps extends ButtonContainerProps {
  isActive?: boolean;
}

const SecondaryButtonContainer = styled(ButtonContainer)<SecondaryButtonContainerProps>`
  ${transition()}
  box-sizing: border-box;
  padding: 9px 22px 10px;
  color: #132144;
  font-weight: 600;
  line-height: 22px;
  background-color: #eef4f6d9;
  background-size: 1px 42px;
  border: 1px solid #dfe3ed;

  ${({ square }) =>
    square &&
    css`
      padding: 9px 20px 10px;
    `}

  ${({ disabled }) =>
    disabled
      ? css`
          color: rgba(19, 33, 68, 0.5);
          background: linear-gradient(-180deg, rgba(238, 244, 246, 0.3) 0%, #eef4f6 100%);

          & ${Icon} {
            opacity: 0.5;
          }
        `
      : css`
          &:hover,
          &:active {
            ${hoverStyles}
          }
        `}

  ${({ isActive }) =>
    isActive &&
    css`
      ${hoverStyles}
    `}
`;

export default SecondaryButtonContainer;
