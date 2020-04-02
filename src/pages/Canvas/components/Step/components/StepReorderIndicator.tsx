import React from 'react';

import { REORDER_INDICATOR_CLASSNAME } from '../constants';
import CaptureZone from './StepReorderCaptureZone';
import IndicatorContainer from './StepReorderIndicatorContainer';

export type StepReorderIndicatorProps = {
  isActive: boolean;
  onMouseUp?: (event: React.MouseEvent) => void;
};

const StepReorderIndicator: React.FC<StepReorderIndicatorProps> = ({ isActive, onMouseUp }) => (
  <IndicatorContainer className={REORDER_INDICATOR_CLASSNAME} isActive={isActive}>
    {isActive && <CaptureZone onMouseUp={onMouseUp} />}
  </IndicatorContainer>
);

export default StepReorderIndicator;
