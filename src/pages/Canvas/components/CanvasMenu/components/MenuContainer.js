import { Container } from '@/components/Panel';
import { styled } from '@/hocs';

const MenuContainer = styled.section`
  display: flex;
  height: 100%;
  width: 100%;

  & ${Container} {
    width: ${({ theme }) => theme.components.menuDrawer.width}px;
  }
`;

export default MenuContainer;
