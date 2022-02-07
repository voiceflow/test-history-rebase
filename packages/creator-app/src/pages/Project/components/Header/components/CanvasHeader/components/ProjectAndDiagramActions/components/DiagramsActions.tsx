import { Models as BaseModels } from '@voiceflow/base-types';
import { BoxFlexCenter } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useFeature, useSelector } from '@/hooks';

import DiagramActions from './DiagramActions';
import DiagramDivider from './DiagramDivider';
import DiagramName from './DiagramName';

const DiagramsActions: React.FC = () => {
  const goToDiagramHistoryPop = useDispatch(Router.goToDiagramHistoryPop);
  const goToDiagramHistoryClear = useDispatch(Router.goToDiagramHistoryClear);

  const rootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const previousDiagramID = useSelector(Creator.previousDiagramIDSelector);
  const activeDiagram = useSelector(DiagramV2.diagramByIDSelector, { id: activeDiagramID });
  const previousDiagram = useSelector(DiagramV2.diagramByIDSelector, { id: previousDiagramID });

  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const isOnlyRootDiagramActive = rootDiagramID === activeDiagramID;
  const rootDiagramIsPreviousDiagram = rootDiagramID === previousDiagramID;
  const dontRenderName = !rootDiagramIsPreviousDiagram && !previousDiagram;

  return (
    <BoxFlexCenter ml={4} overflow="hidden">
      {isOnlyRootDiagramActive ? (
        <DiagramActions diagramID={rootDiagramID} diagramName="Home" disabled />
      ) : (
        <>
          {(!(topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) || activeDiagram?.type !== BaseModels.DiagramType.TOPIC) && (
            <>
              <DiagramDivider />
              <DiagramName onClick={() => rootDiagramID && goToDiagramHistoryClear(rootDiagramID)}>Home</DiagramName>{' '}
            </>
          )}

          {!dontRenderName && !!previousDiagramID && ![rootDiagramID, activeDiagramID].includes(previousDiagramID) && (
            <>
              <DiagramDivider />
              <DiagramName onClick={() => goToDiagramHistoryPop(previousDiagramID)}>
                {rootDiagramIsPreviousDiagram ? 'Home' : previousDiagram?.name}
              </DiagramName>
            </>
          )}

          <DiagramActions diagramID={activeDiagramID} diagramName={activeDiagram?.name} />
        </>
      )}
    </BoxFlexCenter>
  );
};

export default DiagramsActions;
