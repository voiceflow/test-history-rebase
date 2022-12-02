import { OverflowText, User as UIUser } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const User = styled(UIUser).attrs({ flat: true })`
  width: 26px;
  height: 26px;
  box-shadow: none;
  margin-right: 12px;
`;

export const Name = styled(OverflowText)`
  max-width: 158px;
`;
