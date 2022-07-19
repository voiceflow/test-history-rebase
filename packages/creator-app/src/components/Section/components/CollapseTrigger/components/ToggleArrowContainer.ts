import { styled, transition } from '@/hocs/styled';

interface ToggleArrowContainerProps {
  isCollapsed?: boolean;
}

const ToggleArrowContainer = styled.div<ToggleArrowContainerProps>`
  ${transition('transform')}
  color: #becedc;
  transform: ${({ isCollapsed }) => (isCollapsed ? 'rotate(360deg)' : 'rotate(180deg)')};
  cursor: pointer;

  :hover {
    color: #8da2b5;
  }
`;
export default ToggleArrowContainer;
