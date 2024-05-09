import { styled } from '@/hocs/styled';

import { GRID_HEIGHT, GRID_WIDTH } from '../constants';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${GRID_WIDTH}, 1fr);
  grid-template-rows: repeat(${GRID_HEIGHT}, 1fr);

  height: 100%;
  width: 100%;
  min-height: 650px;
  overflow: hidden;
`;
