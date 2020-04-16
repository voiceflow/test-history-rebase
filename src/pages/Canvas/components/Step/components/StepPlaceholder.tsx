import cn from 'classnames';
import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import { REORDER_INDICATOR_CLASSNAME } from '@/pages/Canvas/components/Step/constants';
import { MERGE_ACTIVE_NODE_CLASSNAME } from '@/pages/Canvas/constants';

import CaptureZone from './StepReorderCaptureZone';
import IndicatorContainer from './StepReorderIndicatorContainer';

export type StepPlaceholderProps = {
  variant: BlockVariant;
  isLast: boolean;
};

const StepPlaceholder: React.FC<StepPlaceholderProps> = ({ variant, isLast }) => {
  const [forceHover, setForceHover] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => setForceHover(false), 50);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <IndicatorContainer
      className={cn(MERGE_ACTIVE_NODE_CLASSNAME, REORDER_INDICATOR_CLASSNAME)}
      isActive={true}
      isHovered={forceHover}
      variant={variant}
      isLast={isLast}
    >
      <CaptureZone />
    </IndicatorContainer>
  );
};

export default StepPlaceholder;
