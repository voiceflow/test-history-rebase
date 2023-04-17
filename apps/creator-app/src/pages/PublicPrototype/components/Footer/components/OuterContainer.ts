import { styled } from '@/hocs/styled';

interface OuterContainerProps {
  visible?: boolean;
}

const OuterContainer = styled.div<OuterContainerProps>`
  position: relative;
  overflow: hidden;
  padding-top: 3px;
  background: transparent;
`;

export default OuterContainer;
