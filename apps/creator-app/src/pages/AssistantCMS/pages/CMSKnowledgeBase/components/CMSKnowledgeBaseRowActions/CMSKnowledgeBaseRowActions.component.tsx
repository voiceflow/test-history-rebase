import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Divider, MenuItem } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { ICMSKnowledgeBaseRowActions } from './CMSKnowledgeBaseRowActions.interface';

export const CMSKnowledgeBaseRowActions: React.FC<ICMSKnowledgeBaseRowActions> = ({ id, onClose }) => {
  const document = useSelector(Designer.KnowledgeBase.Document.selectors.oneByID, { id });

  const deleteOne = useDispatch(Designer.KnowledgeBase.Document.effect.deleteOne);
  const resyncMany = useDispatch(Designer.KnowledgeBase.Document.effect.resyncMany);

  const isURL = document?.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.URL;

  return (
    <>
      {isURL && <MenuItem label="Re-sync" onClick={Utils.functional.chainVoid(onClose, () => resyncMany([id]))} prefixIconName="Sync" />}

      {isURL && <Divider />}

      <MenuItem label="Delete" onClick={Utils.functional.chainVoid(onClose, () => deleteOne(id))} prefixIconName="Trash" />
    </>
  );
};
