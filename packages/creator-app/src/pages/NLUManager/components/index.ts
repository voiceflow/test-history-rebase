import { styled } from '@/hocs';

export { default as Content } from './Content';
export { default as Sidebar } from './Sidebar';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  min-width: 500px;
`;

export const EmptyDash = styled.div`
  width: 17px;
  height: 1px;
  border-top: solid 1px rgba(98, 119, 140, 0.5);
  display: inline-block;
`;
