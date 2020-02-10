import { styled } from '@/hocs';

const DropdownContainer = styled.div`
  min-width: 200px;
  margin-right: 5px;
  font-weight: ${({ isCollapsed }) => (isCollapsed ? 'normal' : '600')};
`;

export default DropdownContainer;
