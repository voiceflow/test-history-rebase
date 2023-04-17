import { Flex, LoadCircle } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export { default as DialogHeader } from './DialogHeader';
export { default as NoData } from './NoData';

export const Container = styled(Flex)`
  flex: 4;
  height: 100%;
  background: white;
  flex-direction: column;
`;

export const DialogLoader = styled(LoadCircle)`
  position: absolute;
  bottom: 50%;
`;
