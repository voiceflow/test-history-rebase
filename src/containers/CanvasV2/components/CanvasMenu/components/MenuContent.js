import { styled } from '@/hocs';

const MenuContent = styled.main`
  display: flex;
  height: 100%;
  width: ${({ theme }) => theme.components.menuBar.width}px;
  flex-direction: column;
  border-right: 1px solid #dfe3ed;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.color.gradient[0]};
  overflow: hidden;
  transition: width 150ms ease-in;
  z-index: 30;
  color: #8da2b5;
`;

export default MenuContent;
