import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs';

interface TileProps {
  gridWidth: 1 | 2;
  gridHeight: 1;
}

export const Tile = styled(Box.FlexAlignStart)<TileProps>`
  background-color: #ffffff;

  height: 100%;
  width: 100%;

  grid-column: span ${(props) => props.gridWidth};
  grid-row: span ${(props) => props.gridHeight};

  outline: 1px solid #dfe3ed;
`;
