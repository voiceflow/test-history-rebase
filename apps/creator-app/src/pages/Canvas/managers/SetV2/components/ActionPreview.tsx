import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Preview, stopPropagation, Text } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { useHotkey } from '@/hooks/hotkeys';
import { usePermission } from '@/hooks/permission';
import { Hotkey } from '@/keymap';
import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
import { transformVariablesToReadable } from '@/utils/slot';

interface ActionPreviewProps {
  sets: Realtime.NodeData.SetExpressionV2[];
  onClose: VoidFunction;
  onRemove: VoidFunction;
  onOpenEditor: VoidFunction;
}

const ActionPreview: React.FC<ActionPreviewProps> = ({ sets, onClose, onRemove, onOpenEditor }) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

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
                <Text opacity={0.5}>Set</Text> {`{${set.variable}}`} <Text opacity={0.5}>to</Text>{' '}
                {transformVariablesToReadable(String(set.expression) || "''", entitiesAndVariables.byKey)}
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
