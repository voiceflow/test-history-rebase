import React from 'react';

import * as Step from '@/pages/Canvas/components/Step';

import { useMergeInfo } from '../hooks';
import { ReorderIndicatorProps } from '../types';

const ReorderIndicator = ({ index, onMouseUp }: ReorderIndicatorProps) => {
  const { mustNotBe, mustBeFirst, mustBeLast } = useMergeInfo(index);

  const isActive = !(mustNotBe || mustBeFirst || mustBeLast);

  return <Step.ReorderIndicator isActive={isActive} onMouseUp={onMouseUp} />;
};

export default ReorderIndicator;
