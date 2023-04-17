import { Table } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const TableContainer = styled(Table.Container)`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const TopBadge = styled.div`
  position: absolute;
  left: 55%;
  z-index: 1;
  color: white;
  display: flex;
  align-items: center;
  padding-left: 13px;
  cursor: pointer;
  top: 10px;
  width: 68px;
  height: 32px;
  border-radius: 16px;
  background-color: #2b2f32;
`;
