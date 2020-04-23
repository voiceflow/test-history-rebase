import React from 'react';

import { rootNodeIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import Node from '@/pages/Canvas/components/Node';
import { NodeIDProvider } from '@/pages/Canvas/contexts';
import { ConnectedProps } from '@/types';

const NodeLayer: React.FC<ConnectedNodeLayerProps> = ({ rootNodeIDs }) => (
  <>
    {rootNodeIDs.map((nodeID) => (
      <NodeIDProvider value={nodeID} key={nodeID}>
        <Node />
      </NodeIDProvider>
    ))}
  </>
);

const mapStateToProps = {
  rootNodeIDs: rootNodeIDsSelector,
};

export type ConnectedNodeLayerProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(NodeLayer);
