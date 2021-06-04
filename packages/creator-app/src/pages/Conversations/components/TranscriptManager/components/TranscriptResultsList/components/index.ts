import { styled } from '@/hocs';

export { default as TranscriptResultsItem } from './TranscriptResultsItem';

export const Container = styled.div`
  flex-direction: column;
  flex: 2;
  background: ${({ theme }) => theme.backgrounds.offWhite};
  width: 100%;
  overflow: auto;
`;
