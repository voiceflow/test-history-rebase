import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { useEventualEngine } from '@/hooks/engine';
import { getHotkeys, Hotkey } from '@/keymap';
import CanvasTemplateEditorNewTemplate from '@/pages/Canvas/components/TemplateEditor/NewTemplate';
import { SelectionSetTargetsContext, SelectionTargetsContext } from '@/pages/Project/contexts';

import { DiagramLayoutHeaderAction } from './DiagramLayoutHeaderAction/DiagramLayoutHeaderAction.component';

export const DiagramLayoutHeaderActions: React.FC = () => {
  const selectedTargets = React.useContext(SelectionTargetsContext);
  const setSelectedTargets = React.useContext(SelectionSetTargetsContext);

  const getEngine = useEventualEngine();

  const onCopy = async () => {
    const engine = getEngine();

    if (!engine) return;

    await engine.copyActive(null, { disableSuccessToast: false });
  };

  const onDelete = async () => {
    const engine = getEngine();

    if (!engine) return;

    await engine.removeActive();
  };

  const onComponentCreate = async () => {
    const engine = getEngine();

    if (!engine) return;

    await engine.createComponent();

    setSelectedTargets([]);
  };

  return (
    <Box gap={4}>
      <DiagramLayoutHeaderAction
        tooltip={{ label: 'Create component', hotkeys: getHotkeys(Hotkey.CREATE_COMPONENT) }}
        onClick={onComponentCreate}
        iconName="Component"
      />

      <CanvasTemplateEditorNewTemplate nodeIDs={selectedTargets}>
        {({ onToggle, isOpened }) => (
          <DiagramLayoutHeaderAction
            tooltip={{ label: 'Add to library', hotkeys: getHotkeys(Hotkey.ADD_TO_LIBRARY) }}
            onClick={onToggle}
            iconName="LibraryS"
            isActive={isOpened}
          />
        )}
      </CanvasTemplateEditorNewTemplate>

      <DiagramLayoutHeaderAction tooltip={{ label: 'Copy', hotkeys: getHotkeys(Hotkey.COPY) }} onClick={onCopy} iconName="Copy" />

      <DiagramLayoutHeaderAction tooltip={{ label: 'Delete', hotkeys: getHotkeys(Hotkey.DELETE) }} onClick={onDelete} iconName="Trash" />
    </Box>
  );
};
