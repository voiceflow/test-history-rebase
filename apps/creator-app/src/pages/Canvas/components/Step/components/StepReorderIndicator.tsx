import React from 'react';

import type { HSLShades } from '@/constants';

import { REORDER_INDICATOR_CLASSNAME } from '../constants';
import CaptureZone from './StepReorderCaptureZone';
import IndicatorContainer from './StepReorderIndicatorContainer';

export interface StepReorderIndicatorProps {
  isActive: boolean;
  palette: HSLShades;
  isHovered?: boolean;
  onMouseUp?: (event: React.MouseEvent) => void;
  captureZoneRef?: React.Ref<HTMLDivElement>;
  isLast?: boolean;
}

const StepReorderIndicator: React.FC<StepReorderIndicatorProps> = ({
  isActive,
  isHovered,
  onMouseUp,
  captureZoneRef,
  palette,
  isLast,
}) => (
  <IndicatorContainer
    className={REORDER_INDICATOR_CLASSNAME}
    isActive={isActive}
    isHovered={isHovered}
    palette={palette}
    isLast={isLast}
  >
    {isActive && <CaptureZone ref={captureZoneRef} onMouseUp={onMouseUp} />}
  </IndicatorContainer>
);

export default StepReorderIndicator;
