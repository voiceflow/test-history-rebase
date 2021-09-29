import { WindowScrollerContainer } from '@/components/VirtualList/components';
import { styled } from '@/hocs';

const VariableListContainer = styled.div`
  height: calc(100% - 108px);

  ${WindowScrollerContainer} {
    padding-top: 0;
  }
`;

export default VariableListContainer;
