import cn from 'classnames';
import React from 'react';

import type { HSLShades } from '@/constants';
import { REORDER_INDICATOR_CLASSNAME } from '@/pages/Canvas/components/Step/constants';
import { NODE_MERGE_TARGET_CLASSNAME } from '@/pages/Canvas/constants';

import CaptureZone from './StepReorderCaptureZone';
import IndicatorContainer from './StepReorderIndicatorContainer';

export interface StepPlaceholderProps {
  palette: HSLShades;
  isLast: boolean;
}

const StepPlaceholder: React.FC<StepPlaceholderProps> = ({ palette, isLast }) => {
  const [forceHover, setForceHover] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => setForceHover(false), 50);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <IndicatorContainer
      className={cn(NODE_MERGE_TARGET_CLASSNAME, REORDER_INDICATOR_CLASSNAME)}
      isActive={true}
      isHovered={forceHover}
      palette={palette}
      isLast={isLast}
    >
      <CaptureZone />
    </IndicatorContainer>
  );
};

export default StepPlaceholder;
