import { styled } from '@/hocs';

const ThreadCommentContainer = styled.div`
  max-height: calc(100vh - ${({ theme }) => theme.components.header.height + 32 + 70.5}px);
  overflow-y: auto;
`;

export default ThreadCommentContainer;
