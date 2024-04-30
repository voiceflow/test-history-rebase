import { ButtonContainer } from '@/components/Button';
import type { IconButtonVariant } from '@/components/IconButton/types';
import SvgIcon from '@/components/SvgIcon';
import { colors, css, styled, ThemeColor, transition } from '@/styles';

import type { BaseContainerProps } from './IconButtonContainer';

export interface SquareContainerProps extends BaseContainerProps {
  variant: IconButtonVariant.SQUARE;
  outlined?: boolean;
  isActive?: boolean;
}

const activeStyles = css<SquareContainerProps>`
  background: rgba(238, 244, 246, 0.85);
  border: solid 1px ${colors(ThemeColor.BORDERS)};

  & ${SvgIcon.Container} {
    color: ${({ outlined }) => colors(outlined ? ThemeColor.PRIMARY : ThemeColor.SECONDARY)};
    opacity: 1;
  }
`;

const SquareContainer = styled(ButtonContainer)<SquareContainerProps>`
  ${transition('background', 'border')}

  padding: 12px;
  border: solid 1px ${({ outlined }) => (outlined ? colors(ThemeColor.BORDERS) : 'transparent')};
  border-radius: 5px;

  & ${SvgIcon.Container} {
    max-width: 16px;

    color: ${colors(ThemeColor.SECONDARY)};
    opacity: ${({ outlined }) => (outlined ? 0.8 : 0.65)};
  }

  &:hover {
    background: rgba(238, 244, 246, 0.85);
    border: solid 1px ${colors(ThemeColor.BORDERS)};

    & ${SvgIcon.Container} {
      opacity: ${({ outlined }) => (outlined ? 1 : 0.85)};
    }
  }

  &:active {
    ${activeStyles}
  }

  ${({ isActive }) => isActive && activeStyles}
`;

export default SquareContainer;
