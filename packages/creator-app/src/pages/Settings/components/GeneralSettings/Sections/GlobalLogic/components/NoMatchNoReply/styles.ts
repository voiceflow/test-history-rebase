import { Input } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const DelayTrigger = styled.span<{ onClick?: VoidFunction; active?: boolean }>`
  color: ${({ active }) => (active ? '#3876cb' : '#3d82e2')};
  border-bottom: 1px dotted #3d82e2;
  margin: 0 2px;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};

  &:hover {
    color: #3876cb;
  }
`;

export const DelayInput = styled(Input)`
  width: 200px;
`;
