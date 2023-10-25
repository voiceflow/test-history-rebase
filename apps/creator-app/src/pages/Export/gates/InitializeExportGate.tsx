import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Domain from '@/ducks/domain';
import * as Session from '@/ducks/session';
import { useDispatch, useRouteDiagramID, useSelector } from '@/hooks';

import * as Utils from '../utils';

const InitializeExportGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loaded, setLoaded] = React.useState(false);
  const routeDiagramID = useRouteDiagramID();
  const diagramID = useSelector(Session.activeDiagramIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const domainID = useSelector(Domain.domainIDByTopicIDSelector, { topicID: diagramID });
  const rootDomainID = useSelector(Domain.rootDomainIDSelector);

  const initialize = useDispatch(Utils.initialize);
  const setActiveDomainID = useDispatch(Session.setActiveDomainID);
  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);

  React.useEffect(() => {
    setActiveDomainID(domainID ?? rootDomainID);
    setActiveDiagramID(routeDiagramID);
  }, [routeDiagramID, domainID, rootDomainID]);

  React.useEffect(() => {
    if (versionID && diagramID) {
      initialize(versionID, diagramID).then(() => setLoaded(true));
    }
  }, [versionID, diagramID]);

  return (
    <LoadingGate internalName={InitializeExportGate.name} isLoaded={loaded}>
      {children}
    </LoadingGate>
  );
};

export default InitializeExportGate;
