import { flexApartStyles } from '@ui/components/Flex';
import { css, styled, units } from '@ui/styles';
import { space, SpaceProps } from 'styled-system';

import InfoIconTooltip from './InfoIconTooltip';

export interface HeaderProps extends SpaceProps {
  top?: number;
  sticky?: boolean;
  sticked?: boolean;
  bottomUint?: number;
}

const Header = styled.header<HeaderProps>`
  ${flexApartStyles}
  padding: ${units(2.5)}px ${units(4)}px ${({ theme, bottomUint = 2 }) => units(bottomUint)({ theme })}px ${units(4)}px;
  line-height: 1;
  ${space}

  ${InfoIconTooltip.StyledIcon} {
    opacity: 0;
  }

  &:hover {
    ${InfoIconTooltip.StyledIcon} {
      opacity: 1;
    }
  }

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
    `}

  ${({ top = 0, sticky }) =>
    sticky &&
    css`
      top: ${top}px;
      position: sticky;
      z-index: 2;
    `}

  ${({ sticky, sticked }) =>
    sticky &&
    sticked &&
    css`
      background-color: ${({ theme }) => theme.colors.white};

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-color: ${({ theme }) => theme.colors.separatorSecondary};
      }
    `}
`;

export default Header;
