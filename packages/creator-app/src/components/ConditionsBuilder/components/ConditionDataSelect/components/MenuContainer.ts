import { Menu } from '@voiceflow/ui';

import { styled } from '@/hocs';

const MenuContainer = styled(Menu.Container)`
  z-index: ${({ theme }) => theme.zIndex.popper};
  max-width: 440px;
  width: 440px;
  max-height: 350px;
  padding: 24px 32px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

export default MenuContainer;
