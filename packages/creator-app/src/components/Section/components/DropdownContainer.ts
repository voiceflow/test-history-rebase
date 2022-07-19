import { styled } from '@/hocs/styled';

interface DropdownContainerProps {
  isCollapsed?: boolean;
}

const DropdownContainer = styled.div<DropdownContainerProps>`
  min-width: 200px;
  margin-right: 5px;
  font-weight: ${({ isCollapsed }) => (isCollapsed ? 'normal' : '600')};
`;

export default DropdownContainer;
