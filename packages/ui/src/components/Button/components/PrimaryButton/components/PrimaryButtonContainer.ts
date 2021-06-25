import { css, styled, transition } from '../../../../../styles';
import ButtonContainer, { ButtonContainerProps } from '../../ButtonContainer';
import Icon from './PrimaryButtonIcon';

export interface PrimaryButtonContainerProps extends ButtonContainerProps {
  canHover?: boolean;
}

const PrimaryButtonContainer = styled(ButtonContainer)<PrimaryButtonContainerProps>`
  ${transition('background', 'opacity', 'box-shadow')}
  color: #fff;
  box-shadow: 0 0 1px 0 rgba(17, 49, 96, 0.1), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
  font-weight: 600;
  background: linear-gradient(-180deg, #5d9df5 0%, #176ce0 68%);
  background-size: 1px 52px;
  white-space: nowrap;
  text-align: center;

  ${({ disabled, canHover = true }) =>
    disabled
      ? css`
          background: linear-gradient(180deg, #5d9df56b 0%, #176ce075 100%);
          box-shadow: none;
          & ${Icon} {
            opacity: 0.46;
          }
        `
      : canHover &&
        css`
          &:hover {
            background-position: 0px;
          }
        `}

  &:active {
    box-shadow: 0 0 6px 0 rgba(17, 49, 96, 0.1), 0 6px 12px 0 rgba(17, 49, 96, 0.2);
  }
`;

export default PrimaryButtonContainer;
