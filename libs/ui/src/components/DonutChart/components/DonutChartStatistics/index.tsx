import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import * as S from './styles';

export interface DonutChartStatisticsProps {
  percentage: number;
  delta?: number;
  testID?: string;
}

const DonutChartStatistics: React.FC<DonutChartStatisticsProps> = ({ percentage, delta = 0, testID }) => (
  <S.Container>
    <S.ValueContainer data-testid={testID}>
      <S.Value>{percentage}</S.Value>
      <S.PercentSign>%</S.PercentSign>
    </S.ValueContainer>
    {!!delta && (
      <S.Trend delta={delta}>
        <SvgIcon icon="trendUp" size="13.5" />
        {Math.abs(delta).toFixed(2)}%
      </S.Trend>
    )}
  </S.Container>
);

export default DonutChartStatistics;
