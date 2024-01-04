import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Divider, MenuItem, toast } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { clipboardCopyWithToast } from '@/utils/clipboard.util';

import { ICMSKnowledgeBaseRowActions } from './CMSKnowledgeBaseRowActions.interface';

export const CMSKnowledgeBaseRowActions: React.FC<ICMSKnowledgeBaseRowActions> = ({ id, onClose }) => {
  const document = useSelector(Designer.KnowledgeBase.Document.selectors.oneByID, { id });
  const confirmModal = useConfirmV2Modal();

  const deleteOne = useDispatch(Designer.KnowledgeBase.Document.effect.deleteOne);
  const resyncMany = useDispatch(Designer.KnowledgeBase.Document.effect.resyncMany);

  const isURL = document?.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.URL;

  const onConfirmDelete = async () => {
    await deleteOne(id);

    toast.info(`1 data source deleted`, { showIcon: false });
  };

  const onDelete = () => {
    confirmModal.openVoid({
      body: `Deleted data sources won’t be recoverable. Please confirm that you want to continue.`,
      title: `Delete data source`,
      confirm: onConfirmDelete,
      confirmButtonLabel: 'Delete forever',
      confirmButtonVariant: 'alert',
    });
  };

  return (
    <>
      {isURL && (
        <>
          <MenuItem
            label="Copy link"
            onClick={Utils.functional.chainVoid(
              onClose,
              clipboardCopyWithToast((document.data as BaseModels.Project.KnowledgeBaseURL).url as string)
            )}
            prefixIconName="Link"
          />

          <MenuItem label="Re-sync" onClick={Utils.functional.chainVoid(onClose, () => resyncMany([id]))} prefixIconName="Sync" />

          <Divider />
        </>
      )}

      <MenuItem label="Delete" onClick={Utils.functional.chainVoid(onClose, onDelete)} prefixIconName="Trash" />
    </>
  );
};
