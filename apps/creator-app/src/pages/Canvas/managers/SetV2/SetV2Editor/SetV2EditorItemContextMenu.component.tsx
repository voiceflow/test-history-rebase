import { Utils } from '@voiceflow/common';
import type { IContextMenu } from '@voiceflow/ui-next';
import { ContextMenu, MenuItem } from '@voiceflow/ui-next';
import React from 'react';

interface ISetV2EditorItemContextMenu extends Omit<IContextMenu, 'children'> {
  onRemove: VoidFunction;
  onDuplicate?: VoidFunction;
  onRename: VoidFunction;
}

export const SetV2EditorItemContextMenu: React.FC<ISetV2EditorItemContextMenu> = ({
  width = 133,
  onRemove,
  onDuplicate,
  onRename,
  ...props
}) => (
  <ContextMenu width={width} {...props}>
    {({ onClose }) => (
      <>
        <MenuItem label="Rename" onClick={Utils.functional.chainVoid(onClose, onRename)} prefixIconName="Edit" />
        {onDuplicate && (
          <MenuItem
            label="Duplicate"
            onClick={Utils.functional.chainVoid(onClose, onDuplicate)}
            prefixIconName="Duplicate"
          />
        )}
        <MenuItem label="Delete" onClick={Utils.functional.chainVoid(onClose, onRemove)} prefixIconName="Trash" />
      </>
    )}
  </ContextMenu>
);
