import { MenuContainer as Menu } from '@/components/Menu';
import { styled } from '@/hocs';

const MenuContainer = styled(Menu)`
  /* to override default Popovercontainer width styling */
  max-width: 456px;
  width: 456px;
  max-height: 500px;
  padding-bottom: 0;
`;

export default MenuContainer;
