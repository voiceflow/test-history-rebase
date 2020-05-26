import React from 'react';

import { BlockType } from '@/constants';
import * as Step from '@/pages/Canvas/components/Step';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';

import { useDnDHoverReorderIndicator, useMergeInfo } from '../hooks';
import { ReorderIndicatorProps } from '../types';

const SourceReorderIndicator: React.FC<ReorderIndicatorProps> = ({ index, onMouseUp, variant }) => {
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { parentNode } = nodeEntity.useState((e) => ({
    parentNode: e.resolve().node.parentNode,
  }));
  const engine = React.useContext(EngineContext)!;
  const { mustNotBe, mustBeLast, mustBeFirst } = useMergeInfo(index);
  const [connectBlockDrop, isHovered] = useDnDHoverReorderIndicator(index);

  const isActive = !(mustNotBe || nodeEntity.nodeType === BlockType.INTENT || mustBeLast || (mustBeFirst && engine.hasLinksByNodeID(parentNode!)));

  return (
    <Step.ReorderIndicator isActive={isActive} onMouseUp={onMouseUp} isHovered={isHovered} captureZoneRef={connectBlockDrop} variant={variant} />
  );
};

export default React.memo(SourceReorderIndicator);
