import React from 'react';

import * as Step from '@/pages/Canvas/components/Step';

import { useDnDHoverReorderIndicator, useMergeInfo } from '../hooks';
import { ReorderIndicatorProps } from '../types';

const ReorderIndicator: React.FC<ReorderIndicatorProps> = ({ index, onMouseUp, palette }) => {
  const { mustNotBe, mustBeFirst, mustBeLast } = useMergeInfo(index);

  const [connectBlockDrop, isHovered] = useDnDHoverReorderIndicator(index);

  const isActive = !(mustNotBe || mustBeFirst || mustBeLast);

  return (
    <Step.ReorderIndicator isActive={isActive} onMouseUp={onMouseUp} isHovered={isHovered} captureZoneRef={connectBlockDrop} palette={palette} />
  );
};

export default React.memo(ReorderIndicator);
