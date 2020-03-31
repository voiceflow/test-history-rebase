import React from 'react';

import { BlockType } from '@/constants';
import * as Step from '@/pages/Canvas/components/Step';
import { EngineContext, useNode } from '@/pages/Canvas/contexts';

import { useMergeInfo } from '../hooks';
import { ReorderIndicatorProps } from '../types';

const SourceReorderIndicator = ({ index, onMouseUp }: ReorderIndicatorProps) => {
  const engine = React.useContext(EngineContext)!;
  const { mustNotBe, mustBeLast, mustBeFirst } = useMergeInfo(index);
  const { node } = useNode();

  const isActive = !(mustNotBe || node.type === BlockType.INTENT || mustBeLast || (mustBeFirst && engine.hasLinksByNodeID(node.parentNode!)));

  return <Step.ReorderIndicator isActive={isActive} onMouseUp={onMouseUp} />;
};

export default SourceReorderIndicator;
