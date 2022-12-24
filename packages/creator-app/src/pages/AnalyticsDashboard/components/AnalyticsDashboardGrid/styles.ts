import { styled } from '@/hocs/styled';

const GRID_WIDTH = 3;
const GRID_HEIGHT = 2;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${GRID_WIDTH}, 1fr);
  grid-template-rows: repeat(${GRID_HEIGHT}, 1fr);

  height: ${400 * GRID_HEIGHT}px;
  width: 100%;
`;
