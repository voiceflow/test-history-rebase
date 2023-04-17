import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Box.Flex).attrs({ as: 'header' })`
  width: 100%;
  height: ${({ theme }) => theme.components.page.header.height}px;
  min-height: ${({ theme }) => theme.components.page.header.height}px;
  position: relative;
  background-color: #fff;
  border-bottom: solid 1px ${({ theme }) => theme.colors.borders};
  z-index: 2;
`;

export const Content = styled(Box.Flex)`
  flex: 1;
  height: 100%;
  overflow: hidden;
  overflow: clip;
`;
