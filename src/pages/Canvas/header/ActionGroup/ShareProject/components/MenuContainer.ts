import { MenuContainer as Menu } from '@/components/Menu';
import { styled } from '@/hocs';

const MenuContainer = styled(Menu as any)`
  /* to override default Popovercontainer width styling */
  max-width: 456px;
  width: 456px;
  max-height: 405px;
`;

export default MenuContainer;
