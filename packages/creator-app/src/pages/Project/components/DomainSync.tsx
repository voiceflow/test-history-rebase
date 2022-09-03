import React from 'react';

import * as Session from '@/ducks/session';
import { useDispatch, useRouteDomainID, useSelector } from '@/hooks';

const DomainSync: React.FC = () => {
  const routeDomainID = useRouteDomainID();
  const activeDomainID = useSelector(Session.activeDomainIDSelector);
  const isSynced = routeDomainID === activeDomainID;

  const setActiveDomainID = useDispatch(Session.setActiveDomainID);

  React.useEffect(() => {
    if (!isSynced) {
      setActiveDomainID(routeDomainID);
    }
  }, [routeDomainID, isSynced]);

  return null;
};

export default DomainSync;
