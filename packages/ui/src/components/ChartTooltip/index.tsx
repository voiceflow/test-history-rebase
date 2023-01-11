import React from 'react';

import * as S from './styles';

export interface ChartTooltipProps {
  label: string;
  value: number | string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ label, value }) => (
  <S.Container>
    <S.Label>{label}</S.Label>
    <S.Value>{value}</S.Value>
  </S.Container>
);

export default Object.assign(ChartTooltip, S);
