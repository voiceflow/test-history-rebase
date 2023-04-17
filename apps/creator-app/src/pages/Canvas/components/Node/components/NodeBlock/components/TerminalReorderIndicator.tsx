import React from 'react';

import * as Step from '@/pages/Canvas/components/Step';
import { ManagerContext, NodeEntityContext } from '@/pages/Canvas/contexts';

import { useDnDHoverReorderIndicator, useMergeInfo } from '../hooks';
import { ReorderIndicatorProps } from '../types';

const TerminalReorderIndicator: React.FC<ReorderIndicatorProps> = ({ index, onMouseUp, palette }) => {
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const getManager = React.useContext(ManagerContext)!;

  const { mustNotBe, mustBeFirst } = useMergeInfo(index);
  const [connectBlockDrop, isHovered] = useDnDHoverReorderIndicator(index);

  const { mergeTerminator, isMergeTerminator } = getManager(nodeEntity.nodeType);

  const isActive = !(mustNotBe || mergeTerminator || mustBeFirst || isMergeTerminator?.(nodeEntity.resolve()));

  return (
    <Step.ReorderIndicator
      isActive={isActive}
      onMouseUp={onMouseUp}
      isHovered={isHovered}
      captureZoneRef={connectBlockDrop}
      palette={palette}
      isLast={true}
    />
  );
};

export default React.memo(TerminalReorderIndicator);
