import React from 'react';

import { rootNodeIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import Node from '@/pages/Canvas/components/Node';
import { NodeIDProvider } from '@/pages/Canvas/contexts';

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
