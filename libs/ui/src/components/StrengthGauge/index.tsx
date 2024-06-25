import ProgressBar from '@ui/components/ProgressBar';
import React from 'react';

import { Level, StrengthColor, TOOLTIP_LABEL_MAP } from './constants';
import * as S from './styles';
import type * as T from './types';

export * as StrengthGaugeTypes from './types';

const LINE_MULTIPLIER_MAP: Record<Level, number> = {
  [Level.WEAK]: 0.2,
  [Level.MEDIUM]: 0.5,
  [Level.STRONG]: 0.7,
  [Level.NOT_SET]: 0,
  [Level.LOADING]: 0,
  [Level.VERY_STRONG]: 1,
};

const StrengthGauge: React.FC<T.Props> = ({ level = Level.NOT_SET, width = 100, tooltipLabelMap }) => (
  <S.Container content={tooltipLabelMap?.[level] || TOOLTIP_LABEL_MAP[level]} offset={[0, 8]}>
    <ProgressBar
      width={width}
      color={StrengthColor[level]}
      height={2}
      progress={LINE_MULTIPLIER_MAP[level]}
      loading={level === Level.LOADING}
    />
  </S.Container>
);

export default Object.assign(StrengthGauge, { Level, TOOLTIP_LABEL_MAP, StrengthColor, LINE_MULTIPLIER_MAP });
