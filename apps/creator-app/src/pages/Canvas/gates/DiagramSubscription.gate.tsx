import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LoadingGate } from '@/components/LoadingGate';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Session from '@/ducks/session';
import { useDiagramSubscription, useSelector } from '@/hooks';
import { DiagramLoader } from '@/pages/Project/components/Diagram/DiagramLoader.component';
import { DiagramHeartbeatProvider } from '@/pages/Project/contexts';

import { CanvasBlurLoader } from '../components/CanvasBlurLoader/CanvasBlurLoader.component';

export const DiagramSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const params = useParams<{ diagramID?: string }>();
  const projectID = useSelector(Session.activeProjectIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const creatorDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  const diagramID = params.diagramID ?? activeDiagramID;

  const [canvasBlurShown, setCanvasBlurShown] = useState(creatorDiagramID !== null && creatorDiagramID !== diagramID);

  const diagramContext = React.useMemo(
    () => ({ projectID, versionID, diagramID, workspaceID }),
    [projectID, versionID, diagramID, workspaceID]
  );

  const isSubscribed = useDiagramSubscription(diagramContext, [diagramContext]);

  useEffect(() => {
    if (!creatorDiagramID) return;

    setCanvasBlurShown(creatorDiagramID !== diagramID);
  }, [creatorDiagramID, diagramID]);

  return (
    <LoadingGate
      key={creatorDiagramID}
      isLoaded={!!creatorDiagramID}
      internalName={DiagramSubscriptionGate.name}
      loader={<DiagramLoader />}
    >
      <DiagramHeartbeatProvider isSubscribed={isSubscribed} diagramID={creatorDiagramID} context={diagramContext}>
        {children}

        <CanvasBlurLoader shown={canvasBlurShown} />
      </DiagramHeartbeatProvider>
    </LoadingGate>
  );
};