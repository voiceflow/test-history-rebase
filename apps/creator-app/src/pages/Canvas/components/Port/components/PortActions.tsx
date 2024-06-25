import React from 'react';

import { NodeEntityProvider, PortEntityContext } from '@/pages/Canvas/contexts';

import ActionsNode from '../../Node/components/NodeActions';

interface PortActionsProps {
  isChip?: boolean;
  parentPath?: string;
  parentParams?: Record<string, string>;
}

const PortActions: React.FC<PortActionsProps> = ({ isChip, parentPath, parentParams }) => {
  const sourcePortEntity = React.useContext(PortEntityContext)!;

  const { sourcePortID, sourceNodeID, targetNodeID } = sourcePortEntity.useState((e) => ({
    sourcePortID: e.portID,
    sourceNodeID: e.nodeID,
    targetNodeID: e.targetNodeID,
  }));

  return targetNodeID === null ? null : (
    <NodeEntityProvider id={targetNodeID} key={targetNodeID}>
      <ActionsNode
        isChip={isChip}
        parentPath={parentPath}
        sourcePortID={sourcePortID}
        sourceNodeID={sourceNodeID}
        parentParams={parentParams}
      />
    </NodeEntityProvider>
  );
};

export default PortActions;
