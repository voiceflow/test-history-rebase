import { Utils } from '@voiceflow/common';
import { Preview, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { useHotkey } from '@/hooks/hotkeys';
import { usePermission } from '@/hooks/permission';
import { Hotkey } from '@/keymap';

interface ActionPreviewProps {
  title: string;
  content: string;
  onClose: VoidFunction;
  onRemove: VoidFunction;
  onOpenEditor: VoidFunction;
}

const ActionPreview: React.FC<ActionPreviewProps> = ({ title, content, onClose, onRemove, onOpenEditor }) => {
  const [canOpenEditor] = usePermission(Permission.PROJECT_CANVAS_OPEN_EDITOR);

  useHotkey(Hotkey.DELETE, onRemove);

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>{title}</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        <Preview.Text>{content}</Preview.Text>
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && (
          <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chainVoid(onClose, onOpenEditor)} />
        )}
      </Preview.Footer>
    </Preview>
  );
};
export default ActionPreview;
