import { Utils } from '@voiceflow/common';
import { ContextMenu, MenuItem } from '@voiceflow/ui-next';
import React from 'react';

import type { IResponseAttachmentContextMenu } from './ResponseAttachmentContextMenu.interface';

export const ResponseAttachmentContextMenu: React.FC<IResponseAttachmentContextMenu> = ({ width = 133, onRemove, onDuplicate, ...props }) => (
  <ContextMenu width={width} {...props}>
    {({ onClose }) => (
      <>
        <MenuItem label="Duplicate" onClick={Utils.functional.chainVoid(onClose, onDuplicate)} prefixIconName="Copy" />
        <MenuItem label="Remove" onClick={Utils.functional.chainVoid(onClose, onRemove)} prefixIconName="Trash" />
      </>
    )}
  </ContextMenu>
);
