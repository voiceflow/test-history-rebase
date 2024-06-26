import { Utils } from '@voiceflow/common';
import { Preview, stopPropagation, Text } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { useHotkey } from '@/hooks/hotkeys';
import { usePermission } from '@/hooks/permission';
import { Hotkey } from '@/keymap';

interface SetV3ActionPreviewProps {
  sets: Array<{ id: string; variable: { id: string; name: string } | null; expression: string; label: string }>;
  onClose: VoidFunction;
  onRemove: VoidFunction;
  onOpenEditor: VoidFunction;
}

export const SetV3ActionPreview: React.FC<SetV3ActionPreviewProps> = ({ sets, onClose, onRemove, onOpenEditor }) => {
  const [canOpenEditor] = usePermission(Permission.PROJECT_CANVAS_OPEN_EDITOR);

  useHotkey(Hotkey.DELETE, onRemove);

  const getPreview = (set: {
    id: string;
    variable: { id: string; name: string } | null;
    expression: string;
    label: string;
  }) => {
    if (set?.label) return <>{set.label}</>;
    if (set?.variable && set?.variable?.name && set?.expression)
      return (
        <>
          <Text opacity={0.5}>Set</Text> {`{${set.variable.name}}`} <Text opacity={0.5}>to</Text> {set.expression}
        </>
      );
    if (set?.variable && set?.variable?.name)
      return (
        <>
          <Text opacity={0.5}>Set</Text> {`{${set.variable.name}}`} <Text opacity={0.5}>to ...</Text>
        </>
      );
    if (set?.expression)
      return (
        <>
          <Text opacity={0.5}>Set variable to </Text> {set.expression}
        </>
      );
    return <Text>Select variable</Text>;
  };

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>Set variable</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        {sets.length ? (
          sets.map((set) => (
            <Preview.ContentItem key={set.id}>
              <Preview.Text>{getPreview(set)}</Preview.Text>
            </Preview.ContentItem>
          ))
        ) : (
          <Preview.Text>Select variable</Preview.Text>
        )}
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && (
          <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chainVoid(onClose, onOpenEditor)} />
        )}
      </Preview.Footer>
    </Preview>
  );
};
