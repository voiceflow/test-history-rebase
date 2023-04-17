import { ContentContainer, Header } from '@/components/Section';
import { styled, units } from '@/hocs/styled';

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

  background-color: #fff;
  background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.5), rgba(238, 244, 246, 0.7));
`;

export default PrototypeSidebarContainer;
