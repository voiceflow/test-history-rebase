import { MenuContainer as Menu } from '@/components/Menu';
import { styled } from '@/hocs';

const MenuContainer = styled(Menu)`
  /* to override default Popovercontainer width styling */
  max-width: 438px;
  width: 438px;
  max-height: 506px;
  padding-bottom: 0;
`;

export default MenuContainer;
