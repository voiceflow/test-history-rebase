import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs';

const MenuItemContainer = styled(Flex)`
  padding: 24px 32px 24px 0px;
  cursor: default;
  margin-left: 32px;
  align-items: flex-start;

  :last-child {
    border-bottom: none;
  }
`;

export default MenuItemContainer;
