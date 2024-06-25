import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { tid } from '@voiceflow/style';
import { Divider, MenuItem, notify } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { CMS_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';
import { useCMSResourceGetPath } from '@/pages/AssistantCMS/hooks/cms-resource.hook';
import { clipboardCopy } from '@/utils/clipboard.util';
import { stopPropagation } from '@/utils/handler.util';

import type { ICMSKnowledgeBaseRowActions } from './CMSKnowledgeBaseRowActions.interface';

export const CMSKnowledgeBaseRowActions: React.FC<ICMSKnowledgeBaseRowActions> = ({ id, onClose }) => {
  const TEST_ID = tid(CMS_TEST_ID, 'context-menu');

  const document = useSelector(Designer.KnowledgeBase.Document.selectors.oneByID, { id });
  const confirmModal = useConfirmV2Modal();

  const deleteOne = useDispatch(Designer.KnowledgeBase.Document.effect.deleteOne);
  const resyncMany = useDispatch(Designer.KnowledgeBase.Document.effect.resyncMany);
  const cmsResourceGetPath = useCMSResourceGetPath();
  const isURL = document?.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.URL;

  const onConfirmDelete = async () => {
    await deleteOne(id);

    notify.short.info('1 data source deleted', { showIcon: false });
  };

  const onDelete = () => {
    confirmModal.openVoid({
      body: 'Deleted data sources won’t be recoverable. Please confirm that you want to continue.',
      title: 'Delete data source',
      confirm: onConfirmDelete,
      confirmButtonLabel: 'Delete forever',
      confirmButtonVariant: 'alert',
    });
  };

  const onCopyLink = () => {
    clipboardCopy(`${window.location.origin}${cmsResourceGetPath(id).path}`);
    notify.short.success('Copied');
    onClose();
  };

  return (
    <>
      <MenuItem
        label="Copy link"
        onClick={Utils.functional.chainVoid(onClose, onCopyLink)}
        prefixIconName="Link"
        testID={tid(TEST_ID, 'copy-link')}
      />
      {isURL && (
        <MenuItem
          label="Re-sync"
          onClick={stopPropagation(Utils.functional.chainVoid(onClose, () => resyncMany([id])))}
          prefixIconName="Sync"
          testID={tid(TEST_ID, 're-sync')}
        />
      )}
      <Divider />

      <MenuItem
        label="Delete"
        onClick={Utils.functional.chainVoid(onClose, onDelete)}
        prefixIconName="Trash"
        testID={tid(TEST_ID, 'delete')}
      />
    </>
  );
};
