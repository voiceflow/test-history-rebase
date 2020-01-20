import React from 'react';

import EnterFlow from '@/containers/CanvasV2/components/EnterFlow';
import { diagramByIDSelector } from '@/ducks/diagram';
import { connect } from '@/hocs';

import FlowBlockContainer from './components/FlowBlockContainer';
import FlowButtonOverlay from './components/FlowButtonOverlay';

const FlowBlock = ({ diagram, data }) => {
  if (!diagram) {
    return null;
  }

  return (
    <>
      <FlowBlockContainer>
        <FlowButtonOverlay>
          <EnterFlow diagramID={data.diagramID} />
        </FlowButtonOverlay>
      </FlowBlockContainer>
    </>
  );
};

const mapStateToProps = {
  diagram: diagramByIDSelector,
};

const mergeProps = ({ diagram: getDiagramByID }, _, { data }) => ({
  diagram: data.diagramID && getDiagramByID(data.diagramID),
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(FlowBlock);
