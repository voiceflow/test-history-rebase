import Flex, { flexApartStyles } from '@/componentsV2/Flex';
import { css, styled } from '@/hocs';

const Header = styled(Flex)`
  color: #132144;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  ${({ rightIcon }) =>
    rightIcon &&
    css`
      ${flexApartStyles}
    `}
`;

export default Header;
