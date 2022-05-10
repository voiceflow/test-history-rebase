import React from 'react';

import { Container, Line, StrengthLine } from './components';
import { Level } from './constants';

const TOOLTIP_LABEL_MAP = {
  [Level.WEAK]: 'Weak',
  [Level.MEDIUM]: 'Medium',
  [Level.STRONG]: 'Strong',
  [Level.NOT_SET]: 'Empty',
  [Level.VERY_STRONG]: 'Excellent',
};

const LINE_MULTIPLIER_MAP: Record<Level, number> = {
  [Level.WEAK]: 0.2,
  [Level.MEDIUM]: 0.5,
  [Level.STRONG]: 0.7,
  [Level.NOT_SET]: 0,
  [Level.VERY_STRONG]: 1,
};

interface StrengthGaugeProps {
  level: Level;
  width?: number;
  thickness?: number;
  tooltipLabelMap?: Partial<Record<Level, string>>;
}

const StrengthGauge: React.FC<StrengthGaugeProps> = ({ level = Level.NOT_SET, width = 100, thickness = 2, tooltipLabelMap }) => {
  const strengthLineWidth = width * LINE_MULTIPLIER_MAP[level];

  return (
    <Container title={tooltipLabelMap?.[level] || TOOLTIP_LABEL_MAP[level]}>
      <Line width={width} thickness={thickness}>
        <StrengthLine thickness={thickness} width={strengthLineWidth} strength={level} />
      </Line>
    </Container>
  );
};

export default Object.assign(StrengthGauge, { Level, TOOLTIP_LABEL_MAP });
