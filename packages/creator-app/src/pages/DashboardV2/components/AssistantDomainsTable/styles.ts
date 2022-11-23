import { Table } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Container = styled(Table.Container)`
  border: #eaeff4 solid 1px;
  border-radius: 6px;
  overflow: hidden;
  min-width: auto;
`;

export const Header = styled.header`
  background-color: #eef4f6;
  padding: 16px 32px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Filters = styled.section`
  background-color: #eef4f6;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Actions = styled.section`
  background-color: #eef4f6;
`;

export const Row = styled(Table.Row)`
  padding-top: 23px;
  padding-bottom: 23px;
  cursor: auto;
  &:hover {
    background-color: #fff;
  }
`;

export const Cell = styled.div``;
