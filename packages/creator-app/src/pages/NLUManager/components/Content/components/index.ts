import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Container = styled.div`
  overflow: auto;
  flex: 1;
  overflow-x: hidden;
  min-width: 500px;
`;

export const TableContainer = styled(Box)`
  flex: 1;
  height: 100%;
`;

export const EllipsisCell = styled(Box)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 60px;
`;
