import React from 'react';

import { diagramByIDSelector } from '@/ducks/diagram';
import { connect } from '@/hocs';
import EnterFlow from '@/pages/Canvas/components/EnterFlow';

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

const mergeProps = ({ diagram: getDiagramByID }, _, { data }) => ({
  diagram: data.diagramID && getDiagramByID(data.diagramID),
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(FlowBlock);
