import React from 'react';

import TippyTooltip from '../TippyTooltip';
import { Line, StrengthLine } from './components';
import { StrengthLevel } from './types';

const StrengthTooltip = {
  [StrengthLevel.NOT_SET]: 'Empty',
  [StrengthLevel.WEAK]: 'Weak',
  [StrengthLevel.MEDIUM]: 'Medium',
  [StrengthLevel.STRONG]: 'Strong',
  [StrengthLevel.VERY_STRONG]: 'Excellent',
};

const StrengthLineMultiplier: Record<StrengthLevel, number> = {
  [StrengthLevel.NOT_SET]: 0,
  [StrengthLevel.WEAK]: 0.2,
  [StrengthLevel.MEDIUM]: 0.5,
  [StrengthLevel.STRONG]: 0.7,
  [StrengthLevel.VERY_STRONG]: 1,
};

interface StrengthGauge {
  width?: number;
  thickness?: number;
  strength: StrengthLevel;
  strengthTooltips?: Partial<Record<StrengthLevel, string>>;
}
const StrengthGauge: React.FC<StrengthGauge> = ({ strengthTooltips, thickness = 2, width = 100, strength = StrengthLevel.NOT_SET }) => {
  const strengthLineWidth = width * StrengthLineMultiplier[strength];
  return (
    <TippyTooltip title={strengthTooltips?.[strength] || StrengthTooltip[strength]}>
      <Line width={width} thickness={thickness}>
        <StrengthLine thickness={thickness} width={strengthLineWidth} strength={strength} />
      </Line>
    </TippyTooltip>
  );
};

export default StrengthGauge;
