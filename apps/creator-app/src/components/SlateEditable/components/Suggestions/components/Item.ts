import { Menu } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const Item = styled(Menu.Item)`
  &:hover {
    background: #fff;
  }

  ${({ active }) => active && Menu.Item.activeStyles}
`;

export default Item;
