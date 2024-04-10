import { styled } from '@/hocs/styled';

const ThreadCommentContainer = styled.div<{ newLayout?: boolean; canvasOnly?: boolean }>`
  /* max-height: calc(
    100vh -
      ${({ theme, newLayout, canvasOnly }) =>
    // eslint-disable-next-line no-nested-ternary
    (canvasOnly ? 0 : newLayout ? theme.components.header.newHeight : theme.components.header.height) + 68 + 32}px
  ); */
  margin-bottom: 2px;
`;

export default ThreadCommentContainer;
