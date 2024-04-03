import { FeatureFlag } from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Session from '@/ducks/session';
import { useDispatch, useRouteDomainID, useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature';

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS are released
 */
const DomainSync: React.FC = () => {
  const routeDomainID = useRouteDomainID();
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);
  const activeDomainID = useSelector(Session.activeDomainIDSelector);
  const isSynced = routeDomainID === activeDomainID;

  const setActiveDomainID = useDispatch(Session.setActiveDomainID);

  React.useEffect(() => {
    if (!isSynced && !cmsWorkflows.isEnabled) {
      setActiveDomainID(routeDomainID);
    }
  }, [routeDomainID, isSynced, cmsWorkflows.isEnabled]);

  return null;
};

export default DomainSync;
