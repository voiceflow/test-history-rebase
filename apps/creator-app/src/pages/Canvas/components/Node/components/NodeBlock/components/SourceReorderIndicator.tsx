import React from 'react';

import * as Step from '@/pages/Canvas/components/Step';
import { EngineContext, ManagerContext, NodeEntityContext } from '@/pages/Canvas/contexts';

import { useDnDHoverReorderIndicator, useMergeInfo } from '../hooks';
import type { ReorderIndicatorProps } from '../types';

const SourceReorderIndicator: React.FC<ReorderIndicatorProps> = ({ index, onMouseUp, palette }) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const getManager = React.useContext(ManagerContext)!;

  const { parentNode, type } = nodeEntity.useState((e) => ({
    parentNode: e.resolve().node.parentNode,
    type: e.resolve().node.type,
  }));

  const { mustNotBe, mustBeLast, mustBeFirst } = useMergeInfo(index);
  const [connectBlockDrop, isHovered] = useDnDHoverReorderIndicator(index);

  const isActive = !(
    mustNotBe ||
    getManager(type)?.mergeInitializer ||
    mustBeLast ||
    (mustBeFirst && engine.hasLinksByNodeID(parentNode!))
  );

  return (
    <Step.ReorderIndicator
      isActive={isActive}
      onMouseUp={onMouseUp}
      isHovered={isHovered}
      captureZoneRef={connectBlockDrop}
      palette={palette}
    />
  );
};

export default React.memo(SourceReorderIndicator);
