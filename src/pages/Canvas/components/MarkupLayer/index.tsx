import React from 'react';

import { markupNodeIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import MarkupNode from '@/pages/Canvas/components/MarkupNode';
import NewMarkupShape from '@/pages/Canvas/components/NewMarkupShape';
import { NodeEntityProvider } from '@/pages/Canvas/contexts';
import { ConnectedProps } from '@/types';

import { Container } from './components';

const MarkupLayer: React.FC<ConnectedMarkupLayerProps> = ({ markupNodeIDs }) => (
  <>
    <Container>
      {markupNodeIDs.map((nodeID) => (
        <NodeEntityProvider id={nodeID} key={nodeID}>
          <MarkupNode />
        </NodeEntityProvider>
      ))}

      <NewMarkupShape />
    </Container>
  </>
);

const mapStateToProps = {
  markupNodeIDs: markupNodeIDsSelector,
};

export type ConnectedMarkupLayerProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(MarkupLayer);
