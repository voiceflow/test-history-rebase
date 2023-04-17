import { flexCenterStyles } from '@ui/components/Flex';
import SvgIcon from '@ui/components/SvgIcon';
import { css, styled, transition } from '@ui/styles';

import { ICON_BOX_SIZE } from './icon-button.constant';
import { Size } from './icon-button.enum';

export interface ContainerProps {
  $size: Size;
  $active: boolean;
  $hoverBackground: boolean;
  $activeBackground: boolean;
}

export const hoverActiveBackgroundStyle = css`
  background: #eef4f6;
`;

export const Container = styled.button<ContainerProps>`
  ${flexCenterStyles};
  ${transition('background', 'color')};

  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  padding: ${({ $size }) => ($size - ICON_BOX_SIZE) / 2}px;

  color: rgba(98, 119, 138, 0.85);
  background: transparent;
  border: none;

  border-radius: 6px;
  cursor: pointer;

  ${SvgIcon.Container} {
    ${transition('opacity', 'background', 'transform')}
  }

  &:hover {
    ${({ $hoverBackground }) => $hoverBackground && hoverActiveBackgroundStyle}

    color: rgba(98, 119, 138, 1);
  }

  &:active {
    ${({ $activeBackground }) => $activeBackground && hoverActiveBackgroundStyle}

    color: #132144;
  }

  ${({ $active, $activeBackground }) =>
    $active &&
    css`
      ${$activeBackground && hoverActiveBackgroundStyle}
      color: #132144;

      &:hover {
        color: #132144;
      }
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      pointer-events: none;
    `}
`;
