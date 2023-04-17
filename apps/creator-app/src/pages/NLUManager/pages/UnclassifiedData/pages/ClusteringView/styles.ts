import { Table } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const TableContainer = styled(Table.Container)`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
