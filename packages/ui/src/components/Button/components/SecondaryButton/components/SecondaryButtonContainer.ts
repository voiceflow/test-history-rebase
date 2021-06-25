import { css, styled, transition } from '../../../../../styles';
import ButtonContainer, { ButtonContainerProps } from '../../ButtonContainer';
import Icon from './SecondaryButtonIcon';

export interface SecondaryButtonContainerProps extends ButtonContainerProps {
  flat?: boolean;
  isActive?: boolean;
}

const hoverStyles = css<SecondaryButtonContainerProps>`
  background-color: ${({ flat }) => (flat ? 'rgba(238, 244, 246, 1)' : '#e0ebee')};
`;

const SecondaryButtonContainer = styled(ButtonContainer)<SecondaryButtonContainerProps>`
  ${transition('background', 'opacity', 'box-shadow', 'background-color')}
  border: 1px solid #dfe3ed;
  font-weight: 600;
  padding: 9px 22px 10px;
  color: #132144;
  line-height: 22px;
  background-color: #eef4f6d9;
  background-size: 1px 42px;
  box-sizing: border-box;

  ${({ square }) =>
    square &&
    css`
      padding: 9px 20px 10px;
    `}

  ${({ flat }) =>
    flat &&
    css`
      padding: 9px 18px 10px;
      border-radius: 8px;
      background-color: rgba(238, 244, 246, 0.7);
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
