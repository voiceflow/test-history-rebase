import React from 'react';

import { NodeEntityContext } from '@/pages/Canvas/contexts';
import { CombinedAPI } from '@/pages/Canvas/types';

import NodeBlock from './NodeBlock';
import NodeChip from './NodeChip';

const NodeCombined = React.forwardRef<CombinedAPI>((_, ref) => {
  const nodeEntity = React.useContext(NodeEntityContext)!;

  const { isCanvasChipNode } = nodeEntity.useState((e) => ({
    isCanvasChipNode: e.isCanvasChipNode,
  }));

  return isCanvasChipNode ? <NodeChip ref={ref} /> : <NodeBlock ref={ref} />;
});

export default React.memo(NodeCombined);
