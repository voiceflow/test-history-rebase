import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import { CANVAS_COLOR } from '@/constants/canvas';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Session from '@/ducks/session';
import { withFeatureSwitcher } from '@/hocs/feature.hoc';
import { useDiagramSubscriptionV2, useSelector } from '@/hooks';
import { DiagramHeartbeatProvider } from '@/pages/Project/contexts';

import { LegacyDiagramSubscriptionGate } from './LegacyDiagramSubscription.gate';

export const DiagramSubscriptionGateV2: React.FC<React.PropsWithChildren> = ({ children }) => {
  const diagramID = useSelector(Session.activeDiagramIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const creatorDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  const diagramContext = React.useMemo(() => ({ projectID, versionID, diagramID, workspaceID }), [projectID, versionID, diagramID, workspaceID]);

  const isSubscribed = useDiagramSubscriptionV2(diagramContext, [diagramContext]);

  return (
    <LoadingGate
      key={creatorDiagramID}
      isLoaded={!!creatorDiagramID}
      internalName={DiagramSubscriptionGateV2.name}
      loader={<TabLoader color={CANVAS_COLOR} variant="dark" />}
    >
      <DiagramHeartbeatProvider isSubscribed={isSubscribed} diagramID={creatorDiagramID} context={diagramContext}>
        {children}
      </DiagramHeartbeatProvider>
    </LoadingGate>
  );
};

export const DiagramSubscriptionGate = withFeatureSwitcher(FeatureFlag.CMS_WORKFLOWS, DiagramSubscriptionGateV2)(LegacyDiagramSubscriptionGate);
