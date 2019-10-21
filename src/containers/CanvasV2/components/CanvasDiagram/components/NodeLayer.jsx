import React from 'react';

import Node from '@/containers/CanvasV2/components/Node';
import { NodeIDProvider } from '@/containers/CanvasV2/contexts';
import { rootNodeIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';

const NodeLayer = ({ rootNodeIDs }) =>
  rootNodeIDs.map((nodeID) => (
    <NodeIDProvider value={nodeID} key={nodeID}>
      <Node />
    </NodeIDProvider>
  ));

const mapStateToProps = {
  rootNodeIDs: rootNodeIDsSelector,
};

export default connect(mapStateToProps)(NodeLayer);
