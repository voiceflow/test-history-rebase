import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Divider, MenuItem, toast } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useGetCMSResourcePath } from '@/pages/AssistantCMS/hooks/cms-resource.hook';
import { clipboardCopy } from '@/utils/clipboard.util';
import { stopPropagation } from '@/utils/handler.util';

import { ICMSKnowledgeBaseRowActions } from './CMSKnowledgeBaseRowActions.interface';

export const CMSKnowledgeBaseRowActions: React.FC<ICMSKnowledgeBaseRowActions> = ({ id, onClose }) => {
  const document = useSelector(Designer.KnowledgeBase.Document.selectors.oneByID, { id });
  const confirmModal = useConfirmV2Modal();

  const deleteOne = useDispatch(Designer.KnowledgeBase.Document.effect.deleteOne);
  const resyncMany = useDispatch(Designer.KnowledgeBase.Document.effect.resyncMany);
  const getCMSResourcePath = useGetCMSResourcePath();
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

  const onCopyLink = () => {
    clipboardCopy(`${window.location.origin}${getCMSResourcePath(id).path}`);
    toast.success(`Copied`);
    onClose();
  };

  return (
    <>
      <MenuItem label="Copy link" onClick={Utils.functional.chainVoid(onClose, onCopyLink)} prefixIconName="Link" />
      {isURL && (
        <MenuItem label="Re-sync" onClick={stopPropagation(Utils.functional.chainVoid(onClose, () => resyncMany([id])))} prefixIconName="Sync" />
      )}
      <Divider />

      <MenuItem label="Delete" onClick={Utils.functional.chainVoid(onClose, onDelete)} prefixIconName="Trash" />
    </>
  );
};
