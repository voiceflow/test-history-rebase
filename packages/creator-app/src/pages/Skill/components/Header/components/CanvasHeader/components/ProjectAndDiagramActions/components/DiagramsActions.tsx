import { BoxFlexCenter } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';

import DiagramActions from './DiagramActions';
import DiagramDivider from './DiagramDivider';
import DiagramName from './DiagramName';

const DiagramsActions: React.FC = () => {
  const goToDiagram = useDispatch(Router.goToDiagram);

  const rootDiagramID = useSelector(Version.activeRootDiagramIDSelector);
  const getDiagramByID = useSelector(Diagram.diagramByIDSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);

  const activeDiagram = activeDiagramID ? getDiagramByID(activeDiagramID) : null;
  const isRootDiagramActive = rootDiagramID && activeDiagramID && rootDiagramID === activeDiagramID;

  return (
    <BoxFlexCenter ml={4} overflow="hidden">
      {isRootDiagramActive ? (
        <DiagramActions diagramID={rootDiagramID} diagramName="Home" disabled />
      ) : (
        <>
          <DiagramDivider />
          <DiagramName onClick={() => rootDiagramID && goToDiagram(rootDiagramID)}>Home</DiagramName>

          <DiagramActions diagramID={activeDiagramID} diagramName={activeDiagram?.name} />
        </>
      )}
    </BoxFlexCenter>
  );
};

export default DiagramsActions;
