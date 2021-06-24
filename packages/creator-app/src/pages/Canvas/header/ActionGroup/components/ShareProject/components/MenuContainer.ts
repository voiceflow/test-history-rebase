import { MenuContainer as Menu } from '@voiceflow/ui';

import { styled } from '@/hocs';

const MenuContainer = styled(Menu)`
  /* to override default Popovercontainer width styling */
  width: 438px;
  max-width: 438px;
  max-height: 506px;
  padding-bottom: 0;
`;

export default MenuContainer;
