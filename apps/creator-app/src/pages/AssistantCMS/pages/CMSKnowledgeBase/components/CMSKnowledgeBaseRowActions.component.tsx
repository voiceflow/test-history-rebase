import { Utils } from '@voiceflow/common';
import { Divider, MenuItem } from '@voiceflow/ui-next';
import React from 'react';

interface ICMSKnowledgeBaseRowActions {
  isURL: boolean;
  documentID: string | null;
  onDelete: () => Promise<void>;
  onResync: () => Promise<void>;
  onClose: VoidFunction;
}

export const CMSKnowledgeBaseRowActions: React.FC<ICMSKnowledgeBaseRowActions> = ({ isURL, documentID, onDelete, onResync, onClose }) => {
  return (
    <>
      {isURL && <MenuItem label="Re-sync" onClick={Utils.functional.chainVoid(onClose, onResync)} prefixIconName="Sync" />}
      <Divider />
      {!!documentID && <MenuItem label="Delete" onClick={Utils.functional.chainVoid(onClose, onDelete)} prefixIconName="Trash" />}
    </>
  );
};
