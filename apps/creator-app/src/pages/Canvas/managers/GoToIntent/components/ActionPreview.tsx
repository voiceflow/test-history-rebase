import { Nullable, Utils } from '@voiceflow/common';
import { Preview, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { useHotkey } from '@/hooks/hotkeys';
import { usePermission } from '@/hooks/permission';
import { Hotkey } from '@/keymap';

interface ActionPreviewProps {
  onClose: VoidFunction;
  content: string;
  onRemove: VoidFunction;
  onOpenEditor: VoidFunction;
  onOpenTarget: Nullable<VoidFunction>;
}

const ActionPreview: React.FC<ActionPreviewProps> = ({ onClose, content, onRemove, onOpenEditor, onOpenTarget }) => {
  const [canOpenEditor] = usePermission(Permission.CANVAS_OPEN_EDITOR);

  useHotkey(Hotkey.DELETE, onRemove);

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>Go to intent</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        <Preview.Text>{content}</Preview.Text>
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chainVoid(onClose, onOpenEditor)} />}
        {!!onOpenTarget && <Preview.ButtonIcon ml={8} icon="target" onClick={Utils.functional.chainVoid(onClose, onOpenTarget)} />}
      </Preview.Footer>
    </Preview>
  );
};

export default ActionPreview;
