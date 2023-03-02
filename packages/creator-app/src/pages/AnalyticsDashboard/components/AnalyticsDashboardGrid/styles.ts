import { styled } from '@/hocs/styled';

import { GRID_HEIGHT, GRID_WIDTH, TILE_HEIGHT } from '../constants';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${GRID_WIDTH}, 1fr);
  grid-template-rows: repeat(${GRID_HEIGHT}, 1fr);

  height: ${TILE_HEIGHT * GRID_HEIGHT}px;
  width: 100%;
`;
