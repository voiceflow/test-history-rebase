import { flexApartStyles } from '@ui/components/Flex';
import { css, styled, units } from '@ui/styles';
import type { SpaceProps, TypographyProps } from 'styled-system';
import { space, typography } from 'styled-system';

import InfoIconTooltip from './InfoIconTooltip';

export interface HeaderProps extends SpaceProps, TypographyProps {
  top?: number;
  gap?: number;
  column?: boolean;
  sticky?: boolean;
  sticked?: boolean;
  topUnit?: number;
  leftUnit?: number;
  rightUnit?: number;
  bottomUnit?: number;
  insetBorder?: boolean;
}

const Header = styled.header<HeaderProps>`
  ${flexApartStyles}

  ${({ column }) =>
    column &&
    css`
      flex-direction: column;
    `}

  ${({ theme, topUnit = 2.5, rightUnit = 4, bottomUnit = 2, leftUnit = 4 }) => css`
    padding: ${units(topUnit)({ theme })}px ${units(rightUnit)({ theme })}px ${units(bottomUnit)({ theme })}px
      ${units(leftUnit)({ theme })}px;
  `}


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

  ${({ insetBorder }) =>
    insetBorder &&
    css`
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 32px;
        right: 0;
        height: 1px;
        background-color: ${({ theme }) => theme.colors.separatorSecondary};
      }
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

  ${space}
  ${typography}
`;

export default Header;
