import { CANVAS_INTERACTING_CLASSNAME } from '@/components/Canvas/constants';
import { styled } from '@/hocs/styled';

const ThreadEditorContainer = styled.div`
  max-height: calc(100vh - ${({ theme }) => theme.components.header.height + 32}px);
  overflow: hidden;

  .${CANVAS_INTERACTING_CLASSNAME} & {
    pointer-events: none;
  }
`;

export default ThreadEditorContainer;
