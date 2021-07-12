import { BoxFlexCenter } from '@voiceflow/ui';
import React from 'react';

import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';

import DiagramActions from './DiagramActions';
import DiagramDivider from './DiagramDivider';
import DiagramName from './DiagramName';

const DiagramsActions: React.FC = () => {
  const goToDiagramHistoryPop = useDispatch(Router.goToDiagramHistoryPop);
  const goToDiagramHistoryClear = useDispatch(Router.goToDiagramHistoryClear);

  const rootDiagramID = useSelector(Version.activeRootDiagramIDSelector);
  const getDiagramByID = useSelector(Diagram.diagramByIDSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const previousDiagramID = useSelector(Creator.previousDiagramIDSelector);

  const activeDiagram = activeDiagramID ? getDiagramByID(activeDiagramID) : null;
  const isOnlyRootDiagramActive = rootDiagramID === activeDiagramID;

  return (
    <BoxFlexCenter ml={4} overflow="hidden">
      {isOnlyRootDiagramActive ? (
        <DiagramActions diagramID={rootDiagramID} diagramName="Home" disabled />
      ) : (
        <>
          <DiagramDivider />
          <DiagramName onClick={() => rootDiagramID && goToDiagramHistoryClear(rootDiagramID)}>Home</DiagramName>

          {!!previousDiagramID && ![rootDiagramID, activeDiagramID].includes(previousDiagramID) && (
            <>
              <DiagramDivider />
              <DiagramName onClick={() => goToDiagramHistoryPop(previousDiagramID)}>
                {rootDiagramID === previousDiagramID ? 'Home' : getDiagramByID(previousDiagramID).name}
              </DiagramName>
            </>
          )}

          <DiagramActions diagramID={activeDiagramID} diagramName={rootDiagramID === activeDiagramID ? 'Home' : activeDiagram?.name} />
        </>
      )}
    </BoxFlexCenter>
  );
};

export default DiagramsActions;
