import { ButtonContainer } from '@/components/Button';
import type { IconButtonVariant } from '@/components/IconButton/types';
import SvgIcon from '@/components/SvgIcon';
import { colors, css, styled, ThemeColor } from '@/styles';

import type { BaseContainerProps } from './IconButtonContainer';

export interface SubtleContainerProps extends BaseContainerProps {
  variant: IconButtonVariant.SUBTLE;
  hoverColor?: string;
  active?: boolean;
}

const DEFAULT_ACTIVE_COLOR = '#2e3852';

const SubtleContainer = styled(ButtonContainer)<SubtleContainerProps>`
  border-style: none;

  & ${SvgIcon.Container} {
    max-width: 16px;
    color: ${colors(ThemeColor.TERTIARY)};
  }

  &:hover ${SvgIcon.Container} {
    color: ${({ hoverColor = DEFAULT_ACTIVE_COLOR }) => hoverColor};
  }

  ${({ active, hoverColor = DEFAULT_ACTIVE_COLOR }) =>
    active &&
    css`
      ${SvgIcon.Container} {
        color: ${hoverColor};
      }
    `}
`;

export default SubtleContainer;
