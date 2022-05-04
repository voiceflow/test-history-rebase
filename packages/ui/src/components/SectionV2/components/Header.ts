import { flexApartStyles } from '@ui/components/Flex';
import { css, styled, units } from '@ui/styles';
import { space, SpaceProps } from 'styled-system';

const Header = styled.header<SpaceProps>`
  ${flexApartStyles}
  padding: ${units(1.5)}px ${units(4)}px;
  line-height: 1;
  ${space}

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
    `}
`;

export default Header;
