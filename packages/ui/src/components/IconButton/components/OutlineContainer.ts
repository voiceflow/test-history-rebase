import { css, styled, transition } from '../../../styles';
import { SvgIconContainer } from '../../SvgIcon';
import { IconButtonVariant } from '../types';
import IconButtonContainer, { IconButtonContainerSharedProps } from './IconButtonContainer';

export interface OutlineContainerProps extends IconButtonContainerSharedProps {
  color?: string;
  variant: IconButtonVariant.OUTLINE;
  withOpacity?: boolean;
  preventFocusStyle?: boolean;
}

const activeStyle = css<OutlineContainerProps>`
  background: #eef4f6cc;
  color: ${({ color }) => color ?? 'rgba(19, 33, 68, 0.85)'};
  box-shadow: none !important;
  border: 1px solid #dfe3ed;
  opacity: 1;

  &:hover {
    color: ${({ color }) => color ?? 'rgba(19, 33, 68, 0.85)'};
  }
`;

const OutlineContainer = styled(IconButtonContainer)<OutlineContainerProps>`
  ${transition('border', 'background', 'color', 'box-shadow', 'opacity')}

  border: 1px solid #eaeff4;
  box-shadow: none !important;
  background: #fff;
  color: ${({ color }) => color ?? '#8da2b5'};

  ${SvgIconContainer} {
    opacity: 1;
  }

  &:hover {
    border: 1px solid #dfe3ed;
    box-shadow: none;
    color: ${({ color }) => color ?? '#6e849a'};
    box-shadow: none;
  }

  &:active {
    ${activeStyle}
  }

  ${({ withOpacity }) =>
    withOpacity &&
    css`
      opacity: 0.85;

      &:hover {
        opacity: 1;
      }
    `}

  ${({ preventFocusStyle }) =>
    !preventFocusStyle &&
    css`
      &:focus {
        background: #eef4f6cc;
        color: #132144;
        box-shadow: none !important;
        border: 1px solid #dfe3ed;
      }
    `}

  ${({ active }) => active && activeStyle}
`;

export default OutlineContainer;
