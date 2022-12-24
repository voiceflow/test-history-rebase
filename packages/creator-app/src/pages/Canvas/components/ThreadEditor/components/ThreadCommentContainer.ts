import { styled } from '@/hocs/styled';

const ThreadCommentContainer = styled.div`
  max-height: calc(100vh - ${({ theme }) => theme.components.header.height + 32 + 70.5}px);
  overflow-y: auto;
  margin-bottom: 2px;
`;

export default ThreadCommentContainer;
