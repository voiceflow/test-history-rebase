import SvgIcon from '@ui/components/SvgIcon';
import React from 'react';

import * as S from './styles';

export interface DonutChartStatisticsProps {
  percentage: number;
  delta?: number;
}

const DonutChartStatistics: React.FC<DonutChartStatisticsProps> = ({ percentage, delta = 0 }) => (
  <S.Container>
    <S.ValueContainer>
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
