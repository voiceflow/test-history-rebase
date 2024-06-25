import { Box, Text } from '@voiceflow/ui';
import React from 'react';

import type { QueryResult } from '../../types';
import * as S from './styles';

interface AnalyticsDashboardTileLabel {
  title: string;
  color: string;
}

interface AnalyticsDashboardTileProps extends React.PropsWithChildren {
  title: string;
  description: string;
  labels?: readonly AnalyticsDashboardTileLabel[];
  width: 1 | 2;
  height: 1;
  query: QueryResult<unknown>;
}

const AnalyticsDashboardTile: React.FC<AnalyticsDashboardTileProps> = ({
  title,
  description,
  width,
  height,
  children,
  labels,
  query,
}) => {
  const noData = query.data === null;

  return (
    <S.Tile gridWidth={width} gridHeight={height} column noData={noData}>
      <S.Header column fullWidth pt={24} pb={12} px={32}>
        <Text fontSize={15} fontWeight={600} mb={4}>
          {title}
        </Text>
        <S.HeaderDescription fontSize={13} fontWeight={400} color="#8DA2B5">
          {description}
        </S.HeaderDescription>
        {!noData && labels && labels.length > 0 ? (
          <S.LabelContainer>
            {labels.map((label) => (
              <S.Label key={label.title}>
                <S.LabelIcon color={label.color} />
                <Text fontSize={13} fontWeight={400} color="#62778C">
                  {label.title}
                </Text>
              </S.Label>
            ))}
          </S.LabelContainer>
        ) : undefined}
      </S.Header>

      <Box.FlexAlignStart column width="99%" height="100%" justifyContent="center">
        {children}
      </Box.FlexAlignStart>
    </S.Tile>
  );
};

export default AnalyticsDashboardTile;
