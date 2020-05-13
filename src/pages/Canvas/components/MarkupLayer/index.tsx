import React from 'react';

import { markupNodeIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import MarkupNode from '@/pages/Canvas/components/MarkupNode';
import { NodeIDProvider } from '@/pages/Canvas/contexts';
import { ConnectedProps } from '@/types';

const MarkupLayer: React.FC<ConnectedMarkupLayerProps> = ({ markupNodeIDs }) => (
  <>
    {markupNodeIDs.map((nodeID) => (
      <NodeIDProvider value={nodeID} key={nodeID}>
        <MarkupNode />
      </NodeIDProvider>
    ))}
  </>
);

const mapStateToProps = {
  markupNodeIDs: markupNodeIDsSelector,
};

export type ConnectedMarkupLayerProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(MarkupLayer);
