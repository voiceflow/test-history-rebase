import React from 'react';

import * as S from './styles';

export interface ChartTooltipProps {
  label: string;
  value: number | string;
  action?: string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ label, value, action }) => (
  <S.Container>
    <S.Label>{label}</S.Label>
    <S.Value>{value}</S.Value>
    {action && <S.Action>{action}</S.Action>}
  </S.Container>
);

export default Object.assign(ChartTooltip, S);
