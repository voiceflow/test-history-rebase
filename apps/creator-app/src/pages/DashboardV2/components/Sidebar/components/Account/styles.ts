import { OverflowText, User as UIUser } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const User = styled(UIUser).attrs({ flat: true })`
  width: 26px;
  height: 26px;
  box-shadow: none;
  margin-right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Name = styled(OverflowText)`
  max-width: 158px;
`;
