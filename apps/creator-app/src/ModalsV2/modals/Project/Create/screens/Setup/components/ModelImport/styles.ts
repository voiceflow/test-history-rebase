import { Text } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const ImportLink = styled(Text)<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled }) => (disabled ? 'rgba(93, 157, 245, 0.5)' : 'rgba(93, 157, 245, 1)')};

  &:hover {
    color: #3d82e2 !important;
  }
`;
