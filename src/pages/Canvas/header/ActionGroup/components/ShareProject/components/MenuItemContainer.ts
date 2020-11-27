import Flex from '@/components/Flex';
import { css, styled } from '@/hocs';

const MenuItemContainer = styled(Flex as any)`
  padding: 24px 32px 24px 0px;
  cursor: default;
  margin-left: 32px;
  align-items: flex-start;

  :last-child {
    border-bottom: none;
  }

  ${({ oldHeader }) =>
    oldHeader &&
    css`
      border-bottom: 1px solid #eaeff4;
    `}
`;

export default MenuItemContainer;
