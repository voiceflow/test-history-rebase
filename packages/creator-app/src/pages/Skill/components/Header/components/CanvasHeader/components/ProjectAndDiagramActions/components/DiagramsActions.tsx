import { DiagramType } from '@voiceflow/api-sdk';
import { BoxFlexCenter } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import { useDispatch, useFeature, useSelector } from '@/hooks';

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

  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);

  const activeDiagram = activeDiagramID ? getDiagramByID(activeDiagramID) : null;
  const isOnlyRootDiagramActive = rootDiagramID === activeDiagramID;
  const rootDiagramIsPreviousDiagram = rootDiagramID === previousDiagramID;
  const dontRenderName = !rootDiagramIsPreviousDiagram && !getDiagramByID(previousDiagramID!);

  return (
    <BoxFlexCenter ml={4} overflow="hidden">
      {isOnlyRootDiagramActive ? (
        <DiagramActions diagramID={rootDiagramID} diagramName="Home" disabled />
      ) : (
        <>
          {(!topicsAndComponents.isEnabled || activeDiagram?.type !== DiagramType.TOPIC) && (
            <>
              <DiagramDivider />
              <DiagramName onClick={() => rootDiagramID && goToDiagramHistoryClear(rootDiagramID)}>Home</DiagramName>{' '}
            </>
          )}

          {!dontRenderName && !!previousDiagramID && ![rootDiagramID, activeDiagramID].includes(previousDiagramID) && (
            <>
              <DiagramDivider />
              <DiagramName onClick={() => goToDiagramHistoryPop(previousDiagramID)}>
                {rootDiagramIsPreviousDiagram ? 'Home' : getDiagramByID(previousDiagramID)?.name}
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
