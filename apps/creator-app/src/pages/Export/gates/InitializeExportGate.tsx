import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { useDispatch, useRouteDiagramID, useSelector } from '@/hooks';

import * as Utils from '../utils';

const InitializeExportGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loaded, setLoaded] = React.useState(false);
  const routeDiagramID = useRouteDiagramID();
  const diagramID = useSelector(Session.activeDiagramIDSelector);

  const initialize = useDispatch(Utils.initialize);
  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);

  React.useEffect(() => {
    setActiveDiagramID(routeDiagramID);
  }, [routeDiagramID]);

  React.useEffect(() => {
    if (diagramID) {
      initialize(diagramID).then(() => setLoaded(true));
    }
  }, [diagramID]);

  return (
    <LoadingGate internalName={InitializeExportGate.name} isLoaded={loaded}>
      {children}
    </LoadingGate>
  );
};

export default InitializeExportGate;
