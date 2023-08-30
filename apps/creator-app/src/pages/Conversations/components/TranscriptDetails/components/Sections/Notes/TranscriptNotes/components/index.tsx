import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Box.FlexStart).attrs({ column: true })`
  flex: 1;
  max-width: 295px;
  z-index: 999;
  width: 100%;

  & > * {
    width: 100%;
  }
`;
