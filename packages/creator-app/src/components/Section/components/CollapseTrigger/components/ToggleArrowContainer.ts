import { styled, transition } from '@/hocs';

type ToggleArrowContainerProps = {
  isCollapsed?: boolean;
};

const ToggleArrowContainer = styled.div<ToggleArrowContainerProps>`
  ${transition('transform')}
  color: #becedc;
  transform: ${({ isCollapsed }) => (isCollapsed ? 'rotate(90deg)' : 'rotate(-90deg)')};
  cursor: pointer;

  :hover {
    color: #8da2b5;
  }
`;
export default ToggleArrowContainer;
