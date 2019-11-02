import React from 'react';

import EnterFlow from '@/containers/CanvasV2/components/EnterFlow';
import { EngineContext } from '@/containers/CanvasV2/contexts';

import FlowBlockContainer from './components/FlowBlockContainer';
import FlowButtonOverlay from './components/FlowButtonOverlay';

const FlowBlock = ({ data }) => {
  const engine = React.useContext(EngineContext);
  const diagram = engine.getDiagramByID(data.diagramID);

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

export default FlowBlock;
