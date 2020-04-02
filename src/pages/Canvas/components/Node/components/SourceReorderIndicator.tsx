import React from 'react';

import { BlockType } from '@/constants';
import * as Step from '@/pages/Canvas/components/Step';
import { EngineContext, NodeInjectedProps, withNode } from '@/pages/Canvas/contexts';

import { useMergeInfo } from '../hooks';
import { ReorderIndicatorProps } from '../types';

const SourceReorderIndicator = ({ index, node, onMouseUp }: ReorderIndicatorProps & NodeInjectedProps) => {
  const engine = React.useContext(EngineContext)!;
  const { mustNotBe, mustBeLast, mustBeFirst } = useMergeInfo(index);

  if (!node) return null;

  const isActive = !(mustNotBe || node.type === BlockType.INTENT || mustBeLast || (mustBeFirst && engine.hasLinksByNodeID(node.parentNode!)));

  return <Step.ReorderIndicator isActive={isActive} onMouseUp={onMouseUp} />;
};

export default withNode(React.memo(SourceReorderIndicator));
