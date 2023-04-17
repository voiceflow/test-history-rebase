import { Flex, flexApartStyles } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

interface HeaderProps {
  rightIcon?: boolean;
}

const Header = styled(Flex)<HeaderProps>`
  color: #132144;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;

  ${({ rightIcon }) =>
    rightIcon &&
    css`
      ${flexApartStyles}
    `}
`;

export default Header;
