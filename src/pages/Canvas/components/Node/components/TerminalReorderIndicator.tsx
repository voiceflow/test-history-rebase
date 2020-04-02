import React from 'react';

import * as Step from '@/pages/Canvas/components/Step';
import { ManagerContext, NodeInjectedProps, withNode } from '@/pages/Canvas/contexts';

import { useMergeInfo } from '../hooks';
import { ReorderIndicatorProps } from '../types';

const TerminalReorderIndicator = ({ node, index, onMouseUp }: ReorderIndicatorProps & NodeInjectedProps) => {
  const { mustNotBe, mustBeFirst } = useMergeInfo(index);
  const getManager = React.useContext(ManagerContext)!;

  if (!node) return null;

  const { mergeTerminator } = getManager(node.type);

  const isActive = !(mustNotBe || mergeTerminator || mustBeFirst);

  return <Step.ReorderIndicator isActive={isActive} onMouseUp={onMouseUp} />;
};

export default withNode(React.memo(TerminalReorderIndicator));
