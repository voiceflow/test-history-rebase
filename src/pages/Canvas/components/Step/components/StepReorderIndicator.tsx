import React from 'react';

import { REORDER_INDICATOR_CLASSNAME } from '../constants';
import CaptureZone from './StepReorderCaptureZone';
import IndicatorContainer from './StepReorderIndicatorContainer';

export type StepReorderIndicatorProps = {
  isActive: boolean;
  isHovered?: boolean;
  onMouseUp?: (event: React.MouseEvent) => void;
  captureZoneRef?: React.Ref<HTMLDivElement>;
};

const StepReorderIndicator: React.FC<StepReorderIndicatorProps> = ({ isActive, isHovered, onMouseUp, captureZoneRef }) => (
  <IndicatorContainer className={REORDER_INDICATOR_CLASSNAME} isActive={isActive} isHovered={isHovered}>
    {isActive && <CaptureZone ref={captureZoneRef} onMouseUp={onMouseUp} />}
  </IndicatorContainer>
);

export default StepReorderIndicator;
