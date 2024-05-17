import {FeatureFlag} from '@voiceflow/realtime-sdk';

import { CMSRoute } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useFeature } from '@/hooks/feature';
import { useSessionStorageState } from '@/hooks/storage.hook';
import { useDispatch } from '@/hooks/store.hook';

export const useCMSRoute = () => {
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS)

  const [activeCMSRoute, updateActiveCMSRoute] = useSessionStorageState<CMSRoute>('cms-active-route', cmsWorkflows.isEnabled ? CMSRoute.WORKFLOW : CMSRoute.INTENT);
  const goToCMSResource = useDispatch(Router.goToCMSResource);

  const goToActiveCMSRoute = () => goToCMSResource(activeCMSRoute);

  return { activeCMSRoute, updateActiveCMSRoute, goToActiveCMSRoute };
};
