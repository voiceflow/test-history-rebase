import { styled, transition } from '@/hocs/styled';

interface ToggleArrowContainerProps {
  isCollapsed?: boolean;
}

const ToggleArrowContainer = styled.div<ToggleArrowContainerProps>`
  ${transition('transform', 'opacity')}
  color: rgba(110, 132, 154, 0.65);
  transform: ${({ isCollapsed }) => (isCollapsed ? 'rotate(360deg)' : 'rotate(180deg)')};
  cursor: pointer;

  :hover {
    color: #8da2b5;
  }
`;
export default ToggleArrowContainer;
