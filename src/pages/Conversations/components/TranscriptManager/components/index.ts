import Flex from '@/components/Flex';
import { styled } from '@/hocs';

export { default as TranscriptHeader } from './TranscriptsHeader';

export const Container = styled(Flex)`
  flex: 2;
  height: 100%;
  background: white;
  border-right: 1px solid;
  flex-direction: column;
  border-color: ${({ theme }) => theme.colors.borders};
`;
