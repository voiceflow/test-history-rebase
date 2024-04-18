import { Box, Header } from '@voiceflow/ui-next';
import React from 'react';

import { useEventualEngine } from '@/hooks/engine';
import { getHotkeys, Hotkey } from '@/keymap';
import CanvasTemplateEditorNewTemplate from '@/pages/Canvas/components/TemplateEditor/NewTemplate';
import { SelectionSetTargetsContext, SelectionTargetsContext } from '@/pages/Project/contexts';

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
      <Header.Canvas.ActionButton
        onClick={onComponentCreate}
        hotkeys={getHotkeys(Hotkey.CREATE_COMPONENT)}
        iconName="Component"
        tooltipText="Create component"
      />

      <CanvasTemplateEditorNewTemplate nodeIDs={selectedTargets}>
        {({ onToggle, isOpened }) => (
          <Header.Canvas.ActionButton
            onClick={onToggle}
            hotkeys={getHotkeys(Hotkey.ADD_TO_LIBRARY)}
            iconName="LibraryS"
            tooltipText="Add to library"
            isActive={isOpened}
          />
        )}
      </CanvasTemplateEditorNewTemplate>

      <Header.Canvas.ActionButton onClick={onCopy} hotkeys={getHotkeys(Hotkey.COPY)} iconName="Copy" tooltipText="Copy" />

      <Header.Canvas.ActionButton onClick={onDelete} hotkeys={getHotkeys(Hotkey.DELETE)} iconName="Trash" tooltipText="Delete" />
    </Box>
  );
};
