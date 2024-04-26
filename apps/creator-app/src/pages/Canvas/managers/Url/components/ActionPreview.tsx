import type { Nullable } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { Preview, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { useHotkey } from '@/hooks/hotkeys';
import { usePermission } from '@/hooks/permission';
import { Hotkey } from '@/keymap';

interface ActionPreviewProps {
  onClose: VoidFunction;
  content?: string;
  onRemove: VoidFunction;
  onOpenEditor: VoidFunction;
  onCopyContent: Nullable<VoidFunction>;
}

const ActionPreview: React.FC<ActionPreviewProps> = ({ content, onClose, onRemove, onOpenEditor, onCopyContent }) => {
  const [canOpenEditor] = usePermission(Permission.CANVAS_OPEN_EDITOR);

  useHotkey(Hotkey.DELETE, onRemove);

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>Open URL</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        <Preview.Text>{content}</Preview.Text>
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && (
          <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chainVoid(onClose, onOpenEditor)} />
        )}
        {!!onCopyContent && (
          <Preview.ButtonIcon ml={8} icon="copy" onClick={Utils.functional.chainVoid(onClose, onCopyContent)} />
        )}
      </Preview.Footer>
    </Preview>
  );
};
export default ActionPreview;
