import { Utils } from '@voiceflow/common';
import type { IContextMenu } from '@voiceflow/ui-next';
import { ContextMenu, Divider, MenuItem } from '@voiceflow/ui-next';
import React from 'react';

interface ISetV3EditorItemContextMenu extends Omit<IContextMenu, 'children'> {
  onRemove: VoidFunction;
  onRename: VoidFunction;
  onDuplicate?: VoidFunction;
}

export const SetV3EditorItemContextMenu: React.FC<ISetV3EditorItemContextMenu> = ({
  width = 133,
  onRemove,
  onRename,
  onDuplicate,
  ...props
}) => (
  <ContextMenu width={width} {...props}>
    {({ onClose }) => (
      <>
        <MenuItem label="Rename" onClick={Utils.functional.chainVoid(onClose, onRename)} prefixIconName="Edit" />

        {onDuplicate && (
          <MenuItem
            label="Duplicate"
            onClick={Utils.functional.chainVoid(onDuplicate, onClose)}
            prefixIconName="Duplicate"
          />
        )}

        <Divider noPadding />

        <MenuItem label="Delete" onClick={Utils.functional.chainVoid(onRemove, onClose)} prefixIconName="Trash" />
      </>
    )}
  </ContextMenu>
);
