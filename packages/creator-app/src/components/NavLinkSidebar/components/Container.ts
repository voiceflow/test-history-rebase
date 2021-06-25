import { styled } from '@/hocs';

const Container = styled.div`
  width: ${({ theme }) => theme.components.navLinkSidebar.width}px;
  background-color: #fff;
  border-right: 1px solid ${({ theme }) => theme.colors.borders};
  height: 100%;
  padding: 24px 0;
  overflow-y: auto;
`;

export default Container;
