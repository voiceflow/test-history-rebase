import { Box, Text } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

import { TILE_HEIGHT } from '../constants';

interface TileProps {
  gridWidth: 1 | 2;
  gridHeight: 1;
  noData: boolean;
}

export const Tile = styled(Box.FlexAlignStart)<TileProps>`
  background-color: #ffffff;

  height: ${TILE_HEIGHT}px;
  width: 100%;

  grid-column: span ${(props) => props.gridWidth};
  grid-row: span ${(props) => props.gridHeight};

  outline: 1px solid #dfe3ed;

  ${(props) =>
    props.noData &&
    css`
      background-image: repeating-linear-gradient(
        45deg,
        rgb(141 162 181 / 8%),
        rgb(141 162 181 / 8%) 1.5px,
        rgb(255, 255, 255) 1.5px,
        rgb(255, 255, 255) 6.36px
      );
    `}

  overflow: hidden;
`;

export const Header = styled(Box.FlexAlignStart)`
  background: linear-gradient(#ffffff, transparent);
`;

export const HeaderDescription = styled(Text)`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LabelContainer = styled.span`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const Label = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

interface LabelIconProps {
  color: string;
}

export const LabelIcon = styled.i<LabelIconProps>`
  display: inline-block;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  border-style: solid;
  border-color: ${(props) => props.color};
  border-width: 3px;
`;
