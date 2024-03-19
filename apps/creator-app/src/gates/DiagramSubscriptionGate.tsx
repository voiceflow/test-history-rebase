import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import { CANVAS_COLOR } from '@/constants/canvas';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Session from '@/ducks/session';
import { useDiagramSubscription, useSelector } from '@/hooks';
import { DiagramHeartbeatProvider } from '@/pages/Project/contexts';

const DiagramSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const domainID = useSelector(Session.activeDomainIDSelector);
  const diagramID = useSelector(Session.activeDiagramIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const creatorDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  const diagramContext = React.useMemo(
    () => ({ workspaceID, projectID, versionID, diagramID, domainID }),
    [workspaceID, projectID, versionID, diagramID, domainID]
  );

  const isSubscribed = useDiagramSubscription(diagramContext, [diagramContext]);

  return (
    <LoadingGate
      key={creatorDiagramID}
      isLoaded={!!creatorDiagramID}
      internalName={DiagramSubscriptionGate.name}
      loader={<TabLoader color={CANVAS_COLOR} variant="dark" />}
    >
      <DiagramHeartbeatProvider isSubscribed={isSubscribed} diagramID={creatorDiagramID} context={diagramContext}>
        {children}
      </DiagramHeartbeatProvider>
    </LoadingGate>
  );
};

export default DiagramSubscriptionGate;
