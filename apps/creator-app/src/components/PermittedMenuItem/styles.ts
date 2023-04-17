import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Box.Flex)`
  width: calc(100% + 48px);
  height: 100%;
  margin: 0 -24px;
  padding-right: 24px;
`;

export const Label = styled(Box.Flex)`
  padding-left: 24px;
`;
