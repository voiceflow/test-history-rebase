import { styled } from '@/hocs/styled';

const ThreadCommentContainer = styled.div<{ newLayout?: boolean }>`
  max-height: calc(100vh - ${({ theme, newLayout }) => (newLayout ? theme.components.header.newHeight : theme.components.header.height) + 32 + 68}px);
  overflow-y: auto;
  margin-bottom: 2px;
`;

export default ThreadCommentContainer;
