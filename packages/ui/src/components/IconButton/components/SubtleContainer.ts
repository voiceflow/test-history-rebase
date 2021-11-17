import { ButtonContainer } from '@ui/components/Button';
import { IconButtonVariant } from '@ui/components/IconButton/types';
import { SvgIconContainer } from '@ui/components/SvgIcon';
import { colors, css, styled, ThemeColor } from '@ui/styles';

import { BaseContainerProps } from './IconButtonContainer';

export interface SubtleContainerProps extends BaseContainerProps {
  variant: IconButtonVariant.SUBTLE;
  hoverColor?: string;
  active?: boolean;
}

const DEFAULT_ACTIVE_COLOR = '#2e3852';

const SubtleContainer = styled(ButtonContainer)<SubtleContainerProps>`
  border-style: none;

  & ${SvgIconContainer} {
    max-width: 16px;
    color: ${colors(ThemeColor.TERTIARY)};
  }

  &:hover ${SvgIconContainer} {
    color: ${({ hoverColor = DEFAULT_ACTIVE_COLOR }) => hoverColor};
  }

  ${({ active, hoverColor = DEFAULT_ACTIVE_COLOR }) =>
    active &&
    css`
      ${SvgIconContainer} {
        color: ${hoverColor};
      }
    `}
`;

export default SubtleContainer;
