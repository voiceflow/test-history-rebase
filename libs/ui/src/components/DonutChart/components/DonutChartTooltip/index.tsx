import React from 'react';

import type { DonutChartDatum } from '../../types';
import * as S from './styles';

export interface DonutChartTooltipProps {
  payload?: {
    payload: DonutChartDatum;
  }[];
}

const DonutChartTooltip = ({ payload }: DonutChartTooltipProps) => {
  if (!payload || !payload.length) return null;

  const [{ payload: data }] = payload;

  return (
    <S.Container>
      <S.Label>{data.label}</S.Label>
      <S.Details>
        <S.Percentage>{data.percentage * 100}%</S.Percentage>
        <S.Total>({data.value})</S.Total>
      </S.Details>
    </S.Container>
  );
};

export default Object.assign(DonutChartTooltip, S);
