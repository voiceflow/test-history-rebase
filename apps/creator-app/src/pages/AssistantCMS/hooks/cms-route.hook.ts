import { CMSRoute } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useSessionStorageState } from '@/hooks/storage.hook';
import { useDispatch } from '@/hooks/store.hook';

export const useCMSRoute = () => {
  const [activeCMSRoute, updateActiveCMSRoute] = useSessionStorageState('cms-active-route', CMSRoute.INTENT);
  const goToCMSResource = useDispatch(Router.goToCMSResource);

  const goToActiveCMSRoute = () => goToCMSResource(activeCMSRoute);

  return { activeCMSRoute, updateActiveCMSRoute, goToActiveCMSRoute };
};
