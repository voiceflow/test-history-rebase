import { CANVAS_INTERACTING_CLASSNAME } from '@/components/Canvas/constants';
import { styled } from '@/hocs/styled';

const ThreadEditorContainer = styled.div<{ newLayout?: boolean; canvasOnly?: boolean }>`
  max-height: calc(
    100vh -
      ${({ theme, newLayout, canvasOnly }) =>
        // eslint-disable-next-line no-nested-ternary
        (canvasOnly ? 0 : newLayout ? theme.components.header.newHeight : theme.components.header.height) + 32}px
  );
  overflow-y: auto;
  overflow-x: hidden;

  .${CANVAS_INTERACTING_CLASSNAME} & {
    pointer-events: none;
  }
`;

export default ThreadEditorContainer;
