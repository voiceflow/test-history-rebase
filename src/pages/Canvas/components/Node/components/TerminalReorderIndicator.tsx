import React from 'react';

import * as Step from '@/pages/Canvas/components/Step';
import { ManagerContext, useNode } from '@/pages/Canvas/contexts';

import { useMergeInfo } from '../hooks';
import { ReorderIndicatorProps } from '../types';

const TerminalReorderIndicator = ({ index, onMouseUp }: ReorderIndicatorProps) => {
  const { mustNotBe, mustBeFirst } = useMergeInfo(index);
  const { node } = useNode();
  const getManager = React.useContext(ManagerContext)!;

  if (!node) return null;

  const { mergeTerminator } = getManager(node.type);

  const isActive = !(mustNotBe || mergeTerminator || mustBeFirst);

  return <Step.ReorderIndicator isActive={isActive} onMouseUp={onMouseUp} />;
};

export default TerminalReorderIndicator;
