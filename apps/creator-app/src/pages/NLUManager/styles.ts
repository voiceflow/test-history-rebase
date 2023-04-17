import { styled } from '@/hocs/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  min-width: 500px;
`;

export const Content = styled.div`
  overflow: auto;
  flex: 1;
  overflow-x: hidden;
  min-width: 500px;
`;
