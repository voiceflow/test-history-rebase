import { Box, SectionV2 } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Item = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
  align-items: flex-start;

  & > * {
    width: 100%;
  }
`;

export const Divider = styled(SectionV2.Divider)`
  width: calc(100% + 32px);
  margin-top: 20px;
  margin-bottom: 20px;
`;
