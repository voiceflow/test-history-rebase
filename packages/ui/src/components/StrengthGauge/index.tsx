import React from 'react';

import { Container, Line, StrengthColor, StrengthLine } from './components';
import { Level } from './constants';
import Spinner from './Spinner';
import * as T from './types';

export * as StrengthGaugeTypes from './types';

const TOOLTIP_LABEL_MAP = {
  [Level.WEAK]: 'Weak',
  [Level.MEDIUM]: 'Medium',
  [Level.STRONG]: 'Strong',
  [Level.NOT_SET]: 'Empty',
  [Level.VERY_STRONG]: 'Excellent',
  [Level.LOADING]: 'Loading',
};

const LINE_MULTIPLIER_MAP: Record<Level, number> = {
  [Level.WEAK]: 0.2,
  [Level.MEDIUM]: 0.5,
  [Level.STRONG]: 0.7,
  [Level.NOT_SET]: 0,
  [Level.VERY_STRONG]: 1,
  [Level.LOADING]: -1,
};

const StrengthGauge: React.FC<T.Props> = ({
  level = Level.NOT_SET,
  width = 100,
  thickness = 2,
  tooltipLabelMap,
  background,
  customLevel,
  customColor,
}) => {
  const strengthLineWidth = customLevel ? width * customLevel : width * LINE_MULTIPLIER_MAP[level];

  return (
    <Container title={tooltipLabelMap?.[level] || TOOLTIP_LABEL_MAP[level]} distance={8}>
      <Line width={width} thickness={thickness} background={background}>
        <StrengthLine thickness={thickness} width={strengthLineWidth} strength={level} customColor={customColor} />
      </Line>
    </Container>
  );
};

export default Object.assign(StrengthGauge, { Level, TOOLTIP_LABEL_MAP, StrengthColor, Spinner });
