import { styled } from '@/hocs/styled';

export const Container = styled.div`
  overflow-y: scroll;

  & > * {
    white-space: normal;
  }

  & :last-child {
    border-bottom: none !important;
  }
`;
