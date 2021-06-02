import React from 'react';

import { rootNodeIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import Node from '@/pages/Canvas/components/Node';
import { NodeEntityProvider } from '@/pages/Canvas/contexts';
import { ConnectedProps } from '@/types';

const NodeLayer: React.FC<ConnectedNodeLayerProps> = ({ rootNodeIDs }) => (
  <>
    {rootNodeIDs.map((nodeID) => (
      <NodeEntityProvider id={nodeID} key={nodeID}>
        <Node />
      </NodeEntityProvider>
    ))}
  </>
);

const mapStateToProps = {
  rootNodeIDs: rootNodeIDsSelector,
};

type ConnectedNodeLayerProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(NodeLayer);
