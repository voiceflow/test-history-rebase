import React from 'react';

import * as Step from '@/pages/Canvas/components/Step';
import { ManagerContext, NodeEntityContext } from '@/pages/Canvas/contexts';

import { useDnDHoverReorderIndicator, useMergeInfo } from '../hooks';
import { ReorderIndicatorProps } from '../types';

const TerminalReorderIndicator: React.FC<ReorderIndicatorProps> = ({ index, onMouseUp, variant }) => {
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const getManager = React.useContext(ManagerContext)!;

  const { mustNotBe, mustBeFirst } = useMergeInfo(index);
  const [connectBlockDrop, isHovered] = useDnDHoverReorderIndicator(index);

  const { mergeTerminator } = getManager(nodeEntity.nodeType);

  const isActive = !(mustNotBe || mergeTerminator || mustBeFirst);

  return (
    <Step.ReorderIndicator
      isActive={isActive}
      onMouseUp={onMouseUp}
      isHovered={isHovered}
      captureZoneRef={connectBlockDrop}
      variant={variant}
      isLast={true}
    />
  );
};

export default React.memo(TerminalReorderIndicator);
