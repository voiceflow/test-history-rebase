import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

interface ContentProps {
  withOffset?: boolean;
}

export const Content = styled.div<ContentProps>`
  position: absolute;
  right: ${({ withOffset }) => (withOffset ? 120 : 40)}px;
`;

export const Container = styled(Flex)`
  position: relative;
  padding: 30px;
  padding-bottom: 0;
  align-items: initial;
`;
