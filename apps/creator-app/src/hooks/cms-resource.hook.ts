import { Utils } from '@voiceflow/common';
import { notify } from '@voiceflow/ui-next';
import { generatePath } from 'react-router';

import * as Errors from '@/config/errors';
import type { CMSRoute } from '@/config/routes';
import { Path } from '@/config/routes';
import { Designer, Router, Session } from '@/ducks';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import type { AnyModal, InternalProps } from '@/ModalsV2/types';

import { useDispatch, useStore } from './store.hook';

export const useGoToCMSResourceModal = (resourceType: CMSRoute) => {
  const goToCMSResource = useDispatch(Router.goToCMSResource, resourceType);

  return <Modal extends AnyModal>(modal: Modal, props: Omit<React.ComponentProps<Modal>, keyof InternalProps<any>>) =>
    goToCMSResource(undefined, { cmsResourceModalType: modal.__vfModalType, cmsResourceModalProps: props });
};

export const useGetCMSResourcePath = (resourceType: CMSRoute) => {
  const store = useStore();

  return (resourceID: string) => {
    const state = store.getState();
    const resource = Designer.utils.getCMSResourceOneByIDSelector(resourceType)(state, { id: resourceID });
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    const folderIDs = Designer.Folder.selectors.idsChainByLeafFolderID(state, { folderID: resource?.folderID ?? null });

    const folderPaths = folderIDs.map((id) => `folder/${id}`).join('/');

    if (folderPaths)
      return generatePath(`${Path.CMS_RESOURCE}/${folderPaths}/${resourceID}`, { versionID, resourceType });

    return generatePath(Path.CMS_RESOURCE_ACTIVE, { versionID, resourceID, resourceType });
  };
};

export const useOpenCMSResourceDeleteConfirmModal = () => {
  const confirmModal = useConfirmV2Modal();

  return ({
    size,
    label,
    onConfirm,
  }: {
    size: number;
    label: string;
    onConfirm: () => Promise<void>;
    messageLabel?: string;
  }) => {
    confirmModal.openVoid({
      body: `Deleted ${label} won’t be recoverable unless you restore a previous agent backup. Please confirm that you want to continue.`,
      title: size > 1 ? `Delete ${label} (${size})` : `Delete ${label}`,
      confirm: async () => {
        await onConfirm();

        notify.short.info(
          size > 1 ? `${size} ${label} deleted` : `${Utils.string.capitalizeFirstLetter(label)} deleted`,
          { showIcon: false }
        );
      },
      confirmButtonLabel: 'Delete forever',
      confirmButtonVariant: 'alert',
    });
  };
};
