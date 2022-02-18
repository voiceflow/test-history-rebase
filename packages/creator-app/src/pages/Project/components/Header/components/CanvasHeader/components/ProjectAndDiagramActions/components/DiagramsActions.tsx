import { BoxFlexCenter } from '@voiceflow/ui';
import React from 'react';

import { ROOT_DIAGRAM_NAME } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

import DiagramActions from './DiagramActions';
import DiagramDivider from './DiagramDivider';
import DiagramName from './DiagramName';

const DiagramsActions: React.FC = () => {
  const goToDiagramHistoryPop = useDispatch(Router.goToDiagramHistoryPop);
  const goToDiagramHistoryClear = useDispatch(Router.goToDiagramHistoryClear);

  const rootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const previousDiagramID = useSelector(Creator.previousDiagramIDSelector);
  const rootDiagram = useSelector(DiagramV2.diagramByIDSelector, { id: rootDiagramID });
  const activeDiagram = useSelector(DiagramV2.diagramByIDSelector, { id: activeDiagramID });
  const previousDiagram = useSelector(DiagramV2.diagramByIDSelector, { id: previousDiagramID });

  const isOnlyRootDiagramActive = rootDiagramID === activeDiagramID;
  const rootDiagramIsPreviousDiagram = rootDiagramID === previousDiagramID;
  const dontRenderName = !rootDiagramIsPreviousDiagram && !previousDiagram;
  const rootDiagramName = rootDiagram?.name === ROOT_DIAGRAM_NAME ? 'Home' : rootDiagram?.name;

  return (
    <BoxFlexCenter ml={4} overflow="hidden">
      {isOnlyRootDiagramActive ? (
        <DiagramActions diagramID={rootDiagramID} diagramName={rootDiagramName} />
      ) : (
        <>
          <DiagramDivider />
          <DiagramName onClick={() => rootDiagramID && goToDiagramHistoryClear(rootDiagramID)}>{rootDiagramName}</DiagramName>

          {!dontRenderName && !!previousDiagramID && ![rootDiagramID, activeDiagramID].includes(previousDiagramID) && (
            <>
              <DiagramDivider />
              <DiagramName onClick={() => goToDiagramHistoryPop(previousDiagramID)}>
                {rootDiagramIsPreviousDiagram ? rootDiagramName : previousDiagram?.name}
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
