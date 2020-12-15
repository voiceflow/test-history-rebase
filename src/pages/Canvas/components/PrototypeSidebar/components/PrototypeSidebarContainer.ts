import { ContentContainer, Header } from '@/components/Section';
import { css, styled, units } from '@/hocs';

type PrototypeSidebarContainerProps = {
  generalPrototypeEnabled?: boolean;
};

const PrototypeSidebarContainer = styled.div<PrototypeSidebarContainerProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  user-select: none;

  ${Header}, ${ContentContainer} {
    padding-right: ${units(3)}px;
    padding-left: ${units(3)}px;
  }

  ${({ generalPrototypeEnabled }) =>
    generalPrototypeEnabled &&
    css`
      background-color: 'rgba(238, 244, 246, 0.5)';
    `}
`;

export default PrototypeSidebarContainer;
