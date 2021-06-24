import { FlexApart } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Container = styled(FlexApart)`
  height: 72px;
  padding: 26px 32px;
  width: 100%;
  background: white;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.borders};
`;
