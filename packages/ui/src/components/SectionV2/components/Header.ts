import { flexApartStyles } from '@ui/components/Flex';
import { css, styled, units } from '@ui/styles';
import { space, SpaceProps } from 'styled-system';

export interface HeaderProps extends SpaceProps {
  sticky?: boolean;
  sticked?: boolean;
}

const Header = styled.header<HeaderProps>`
  ${flexApartStyles}
  padding: ${units(2.5)}px ${units(4)}px ${units(2)}px ${units(4)}px;
  margin: ${units(-1)}px 0px ${units(-0.5)}px 0px;
  line-height: 1;
  ${space}

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
    `}

  ${({ sticky }) =>
    sticky &&
    css`
      top: 0;
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
