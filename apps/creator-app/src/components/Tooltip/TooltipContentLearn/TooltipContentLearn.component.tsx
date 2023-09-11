import { Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import type { ITooltipContentLearn } from './TooltipContentLearn.interface';

export const TooltipContentLearn: React.FC<ITooltipContentLearn> = ({ label, onLearnClick }) => (
  <>
    <Tooltip.Caption>{label}</Tooltip.Caption>
    <Tooltip.Button label="Learn" onClick={onLearnClick} />
  </>
);
