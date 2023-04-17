import { styled } from '@/hocs/styled';

import Title from './Title';

const NavLinkSidebarTitle = styled(Title)`
  height: 65px;
  display: flex;
  padding-right: 24px;
  justify-content: space-between;
  min-width: ${({ theme }) => theme.components.navSidebar.width - 16}px;
  border-right: 1px solid ${({ theme }) => theme.colors.borders};
  padding-left: 14px;
`;

export default NavLinkSidebarTitle;
