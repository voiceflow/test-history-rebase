import SvgIcon from '@ui/components/SvgIcon';
import React from 'react';

import * as S from './styles';

export interface DonutChartStatisticsProps {
  percentage: number;
  delta?: number;
}

const DonutChartStatistics: React.FC<DonutChartStatisticsProps> = ({ percentage, delta }) => (
  <foreignObject width="100%" height="100%">
    <S.Container>
      <S.Value>{percentage} %</S.Value>
      {delta != null && (
        <S.Trend delta={delta}>
          <SvgIcon icon="upgrade" />
          {delta?.toFixed(2)}%
        </S.Trend>
      )}
    </S.Container>
  </foreignObject>
);

export default DonutChartStatistics;
