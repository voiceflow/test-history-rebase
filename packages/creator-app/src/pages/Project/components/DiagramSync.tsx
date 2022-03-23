import React from 'react';

import * as Session from '@/ducks/session';
import { useDispatch, useRouteDiagramID, useSelector } from '@/hooks';

const DiagramSync: React.FC = () => {
  const routeDiagramID = useRouteDiagramID();
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const isSynced = routeDiagramID === activeDiagramID;

  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);

  React.useEffect(() => {
    if (!isSynced) {
      setActiveDiagramID(routeDiagramID);
    }
  }, [routeDiagramID, isSynced]);

  return null;
};

export default DiagramSync;
