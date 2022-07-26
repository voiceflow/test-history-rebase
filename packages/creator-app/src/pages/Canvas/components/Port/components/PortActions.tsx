import React from 'react';

import { NodeEntityProvider, PortEntityContext } from '@/pages/Canvas/contexts';

import ActionsNode from '../../Node/components/NodeActions';

interface PortActionsProps {
  parentPath?: string;
}

const PortActions: React.FC<PortActionsProps> = ({ parentPath }) => {
  const sourcePortEntity = React.useContext(PortEntityContext)!;

  const { sourcePortID, sourceNodeID, targetNodeID } = sourcePortEntity.useState((e) => ({
    sourcePortID: e.portID,
    sourceNodeID: e.nodeID,
    targetNodeID: e.targetNodeID,
  }));

  return targetNodeID === null ? null : (
    <NodeEntityProvider id={targetNodeID} key={targetNodeID}>
      <ActionsNode parentPath={parentPath} sourcePortID={sourcePortID} sourceNodeID={sourceNodeID} />
    </NodeEntityProvider>
  );
};

export default PortActions;
