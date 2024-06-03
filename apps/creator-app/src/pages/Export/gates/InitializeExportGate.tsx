import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { useDispatch, useRouteDiagramID, useSelector } from '@/hooks';

import * as Utils from '../utils';

const InitializeExportGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loaded, setLoaded] = React.useState(false);
  const routeDiagramID = useRouteDiagramID();

  const diagramID = useSelector(Session.activeDiagramIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);

  const initialize = useDispatch(Utils.initialize);

  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);

  React.useEffect(() => {
    setActiveDiagramID(routeDiagramID);
  }, [routeDiagramID]);

  React.useEffect(() => {
    if (versionID && diagramID) {
      // TODO: [replay issue] - remove dispatch from gate use effect
      initialize(versionID, diagramID)
        .then(() => setLoaded(true))
        // eslint-disable-next-line no-console
        .catch(console.error);
    }
  }, [versionID, diagramID]);

  return (
    <LoadingGate internalName={InitializeExportGate.name} isLoaded={loaded} loader={<TabLoader variant="dark" />}>
      {children}
    </LoadingGate>
  );
};

export default InitializeExportGate;
