import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import * as Domain from '@/ducks/domain';
import * as Session from '@/ducks/session';
import { useDispatch, useRouteDiagramID, useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature';

import * as Utils from '../utils';

const InitializeExportGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loaded, setLoaded] = React.useState(false);
  const routeDiagramID = useRouteDiagramID();
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const diagramID = useSelector(Session.activeDiagramIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const domainID = useSelector(Domain.domainIDByTopicIDSelector, { topicID: diagramID });
  const rootDomainID = useSelector(Domain.rootDomainIDSelector);

  const initialize = useDispatch(Utils.initialize);
  const setActiveDomainID = useDispatch(Session.setActiveDomainID);
  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);

  React.useEffect(() => {
    // TODO: [replay issue] - remove dispatch from gate use effect

    if (!cmsWorkflows.isEnabled) {
      setActiveDomainID(domainID ?? rootDomainID);
    }

    setActiveDiagramID(routeDiagramID);
  }, [routeDiagramID, domainID, rootDomainID, cmsWorkflows.isEnabled]);

  React.useEffect(() => {
    if (versionID && diagramID) {
      // TODO: [replay issue] - remove dispatch from gate use effect
      initialize(versionID, diagramID).then(() => setLoaded(true));
    }
  }, [versionID, diagramID]);

  return (
    <LoadingGate internalName={InitializeExportGate.name} isLoaded={loaded} loader={<TabLoader variant="dark" />}>
      {children}
    </LoadingGate>
  );
};

export default InitializeExportGate;
