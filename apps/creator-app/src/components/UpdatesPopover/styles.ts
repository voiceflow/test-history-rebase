import { styled } from '@/hocs/styled';

export const Container = styled.div`
  & > * {
    white-space: normal;
  }

  & :last-child {
    border-bottom: none !important;
  }
`;
