import { CMSRoute } from '@/config/routes';
import * as Router from '@/ducks/router';
import { AnyModal, InternalProps } from '@/ModalsV2/types';

import { useDispatch } from './store.hook';

export const useGoToCMSResourceModal = (resourceType: CMSRoute) => {
  const goToCMSResource = useDispatch(Router.goToCMSResource, resourceType);

  return <Modal extends AnyModal>(modal: Modal, props: Omit<React.ComponentProps<Modal>, keyof InternalProps<any>>) =>
    goToCMSResource(undefined, { cmsResourceModalType: modal.__vfModalType, cmsResourceModalProps: props });
};
