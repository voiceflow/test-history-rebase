import { Utils } from '@voiceflow/common';
import { Preview, stopPropagation, Text } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { useHotkey } from '@/hooks/hotkeys';
import { usePermission } from '@/hooks/permission';
import { Hotkey } from '@/keymap';

interface ActionPreviewProps {
  sets: Array<{ id: string; variable: { id: string; name: string }; expression: string }>;
  onClose: VoidFunction;
  onRemove: VoidFunction;
  onOpenEditor: VoidFunction;
}

const ActionPreview: React.FC<ActionPreviewProps> = ({ sets, onClose, onRemove, onOpenEditor }) => {
  const [canOpenEditor] = usePermission(Permission.CANVAS_OPEN_EDITOR);

  useHotkey(Hotkey.DELETE, onRemove);

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>Set variable</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        {sets.length ? (
          sets.map((set) => (
            <Preview.ContentItem key={set.id}>
              <Preview.Text>
                <Text opacity={0.5}>Set</Text> {`{${set.variable.name}}`} <Text opacity={0.5}>to</Text> {set.expression}
              </Preview.Text>
            </Preview.ContentItem>
          ))
        ) : (
          <Preview.Text>Select variable</Preview.Text>
        )}
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chainVoid(onClose, onOpenEditor)} />}
      </Preview.Footer>
    </Preview>
  );
};

export default ActionPreview;
