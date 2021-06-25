import { styled } from '@/hocs';

import Title from './Title';

const NavLinkSidebarTitle = styled(Title)`
  width: ${({ theme }) => theme.components.navLinkSidebar.width - 18}px;
  border-right: 1px solid ${({ theme }) => theme.colors.borders};
  padding-left: 14px;
`;

export default NavLinkSidebarTitle;
