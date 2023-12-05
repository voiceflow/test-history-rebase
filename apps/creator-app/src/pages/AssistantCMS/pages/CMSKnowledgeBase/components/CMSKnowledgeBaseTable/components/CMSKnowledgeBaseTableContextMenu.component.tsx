import { Utils } from '@voiceflow/common';
import { MenuItem } from '@voiceflow/ui-next';
import React from 'react';

import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

export const TableContextMenu: React.FC<{ id: string; onClose: VoidFunction }> = ({ id, onClose }) => {
  const {
    actions: { remove },
  } = React.useContext(CMSKnowledgeBaseContext);
  return <MenuItem key={id} prefixIconName="Trash" label="Delete" onClick={Utils.functional.chainVoid(onClose, () => remove(id))} />;
};
