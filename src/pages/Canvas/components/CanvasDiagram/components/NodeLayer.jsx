import React from 'react';

import { FeatureFlag } from '@/config/features';
import { rootNodeIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import Node from '@/pages/Canvas/components/Node';
import { NodeIDProvider } from '@/pages/Canvas/contexts';

const NodeLayer = ({ rootNodeIDs }) => {
  const blockRedesign = useFeature(FeatureFlag.BLOCK_REDESIGN);

  return rootNodeIDs.map((nodeID) => (
    <NodeIDProvider value={nodeID} key={nodeID}>
      <Node isBlockRedesignEnabled={blockRedesign.isEnabled} />
    </NodeIDProvider>
  ));
};

const mapStateToProps = {
  rootNodeIDs: rootNodeIDsSelector,
};

export default connect(mapStateToProps)(NodeLayer);
