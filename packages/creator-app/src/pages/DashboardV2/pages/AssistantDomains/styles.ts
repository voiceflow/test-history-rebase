import { styled } from '@/hocs';

export const ProjectListWrapper = styled.section`
  width: 100%;
  flex: 1;
  overflow-y: scroll;
  padding: 32px;
  height: calc(100vh - 60px);
`;

export const Item = styled.div`
  width: 100%;
  padding-bottom: 20px;
  display: inline-flex;
`;
