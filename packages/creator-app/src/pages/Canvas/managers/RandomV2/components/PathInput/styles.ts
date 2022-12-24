import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const RemoveContainer = styled(Box)<{ disabled: boolean }>`
  cursor: not-allowed;
  color: ${({ disabled }) => (disabled ? '#BECEDC' : '#6E849A')};
`;
