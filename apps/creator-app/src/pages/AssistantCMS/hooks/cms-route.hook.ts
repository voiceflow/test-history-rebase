import { useSessionStorageState } from '@voiceflow/ui';

import { CMSRoute } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks/store.hook';

export const useCMSRoute = () => {
  const [activeCMSRoute, updateActiveCMSRoute] = useSessionStorageState('cms-active-route', CMSRoute.INTENT);
  const goToCMSResource = useDispatch(Router.goToCMSResource);

  const redirectToActiveRoute = () => goToCMSResource(activeCMSRoute);

  return { activeCMSRoute, updateActiveCMSRoute, redirectToActiveRoute };
};
