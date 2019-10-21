import React from 'react';

import EnterFlow from '@/containers/CanvasV2/components/EnterFlow';
import { diagramByIDSelector } from '@/ducks/diagram';
import { connect } from '@/hocs';

import FlowBlockContainer from './components/FlowBlockContainer';
import FlowButtonOverlay from './components/FlowButtonOverlay';

const FlowBlock = ({ diagram }) => {
  if (!diagram) {
    return null;
  }

  return (
    <>
      <FlowBlockContainer>
        <FlowButtonOverlay>
          <EnterFlow diagramID={diagram.id} />
        </FlowButtonOverlay>
      </FlowBlockContainer>
    </>
  );
};

const mapStateToProps = {
  diagram: diagramByIDSelector,
};

const mergeProps = ({ diagram: getDiagram }, _, { data }) => ({
  diagram: data.diagramID && getDiagram(data.diagramID),
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(FlowBlock);
