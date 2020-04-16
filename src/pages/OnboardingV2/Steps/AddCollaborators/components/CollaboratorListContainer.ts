import { styled } from '@/hocs';

const CollaboratorListContainer = styled.div<{ hasError?: boolean; isDisabled?: boolean }>`
  margin-bottom: ${({ hasError }) => (hasError ? '13px' : '16px')};
`;

export default CollaboratorListContainer;
