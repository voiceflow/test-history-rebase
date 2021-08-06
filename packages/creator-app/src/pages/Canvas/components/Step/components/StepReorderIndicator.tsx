import React from 'react';

import { BlockVariant } from '@/constants/canvas';

import { REORDER_INDICATOR_CLASSNAME } from '../constants';
import CaptureZone from './StepReorderCaptureZone';
import IndicatorContainer from './StepReorderIndicatorContainer';

export interface StepReorderIndicatorProps {
  isActive: boolean;
  variant: BlockVariant;
  isHovered?: boolean;
  onMouseUp?: (event: React.MouseEvent) => void;
  captureZoneRef?: React.Ref<HTMLDivElement>;
  isLast?: boolean;
}

const StepReorderIndicator: React.FC<StepReorderIndicatorProps> = ({ isActive, isHovered, onMouseUp, captureZoneRef, variant, isLast }) => (
  <IndicatorContainer className={REORDER_INDICATOR_CLASSNAME} isActive={isActive} isHovered={isHovered} variant={variant} isLast={isLast}>
    {isActive && <CaptureZone ref={captureZoneRef} onMouseUp={onMouseUp} />}
  </IndicatorContainer>
);

export default StepReorderIndicator;
