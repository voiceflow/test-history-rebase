import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export { default as TranscriptResultsList } from './TranscriptResultsList';
export type { TranscriptsHeaderProps } from './TranscriptsHeader';
export { default as TranscriptHeader } from './TranscriptsHeader';

export const Container = styled(Flex)`
  flex: 2;
  height: 100%;
  max-width: 340px;
  background: white;
  border-right: 1px solid;
  flex-direction: column;
  border-color: ${({ theme }) => theme.colors.borders};
`;
