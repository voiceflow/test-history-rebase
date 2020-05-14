import Flex from '@/components/Flex';
import { styled } from '@/hocs';

const MenuItemContainer = styled(Flex as any)`
  padding: 24px 32px 24px 0px;
  border-bottom: 1px solid #eaeff4;
  cursor: default;
  margin-left: 32px;
  align-items: flex-start;

  :last-child {
    border-bottom: none;
  }
`;

export default MenuItemContainer;
