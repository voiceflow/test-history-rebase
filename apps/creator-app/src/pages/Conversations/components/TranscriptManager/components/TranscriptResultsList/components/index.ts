import { styled } from '@/hocs/styled';

export { default as TranscriptResultsItem } from './TranscriptResultsItem';

export const Container = styled.div`
  flex-direction: column;
  flex: 2;
  background: ${({ theme }) => theme.backgrounds.lightGray};
  width: 100%;
  overflow: auto;
`;
