import React from 'react';

import * as Step from '@/pages/Canvas/components/Step';
import { EngineContext, ManagerContext, NodeEntityContext } from '@/pages/Canvas/contexts';

import { useDnDHoverReorderIndicator, useMergeInfo } from '../hooks';
import { ReorderIndicatorProps } from '../types';

const SourceReorderIndicator: React.FC<ReorderIndicatorProps> = ({ index, onMouseUp, variant }) => {
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { parentNode, type } = nodeEntity.useState((e) => ({
    parentNode: e.resolve().node.parentNode,
    type: e.resolve().node.type,
  }));
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const { mustNotBe, mustBeLast, mustBeFirst } = useMergeInfo(index);
  const [connectBlockDrop, isHovered] = useDnDHoverReorderIndicator(index);

  const isActive = !(mustNotBe || getManager(type)?.mergeInitializer || mustBeLast || (mustBeFirst && engine.hasLinksByNodeID(parentNode!)));

  return (
    <Step.ReorderIndicator isActive={isActive} onMouseUp={onMouseUp} isHovered={isHovered} captureZoneRef={connectBlockDrop} variant={variant} />
  );
};

export default React.memo(SourceReorderIndicator);
