import { Box, Text } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface AnalyticsDashboardTileLabel {
  title: string;
  color: string;
}

interface AnalyticsDashboardTileProps {
  title: string;
  description: string;
  children: React.ReactNode;
  labels?: readonly AnalyticsDashboardTileLabel[];
  width: 1 | 2;
  height: 1;
}

const AnalyticsDashboardTile: React.FC<AnalyticsDashboardTileProps> = ({ title, description, width, height, children }) => {
  return (
    <S.Tile gridWidth={width} gridHeight={height} column>
      <Box.FlexAlignStart column pt={24} pb={12} px={32}>
        <Text fontSize={15} fontWeight={600}>
          {title}
        </Text>
        <Text fontSize={13} fontWeight={400} color="#8DA2B5">
          {description}
        </Text>
      </Box.FlexAlignStart>

      {children}
    </S.Tile>
  );
};

export default AnalyticsDashboardTile;
