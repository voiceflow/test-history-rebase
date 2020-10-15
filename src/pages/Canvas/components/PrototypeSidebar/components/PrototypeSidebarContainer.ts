import { ContentContainer, Header } from '@/components/Section';
import { styled, units } from '@/hocs';

const PrototypeSidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  user-select: none;

  ${Header}, ${ContentContainer} {
    padding-right: ${units(3)}px;
    padding-left: ${units(3)}px;
  }
`;

export default PrototypeSidebarContainer;
