import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useMapManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import useCanvasVisibilityOption, { LABELS_V2 } from '@/pages/Canvas/managers/hooks/useCanvasVisibilityOption';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { textFactory } from '../constants';
import EditorItem from './EditorItem';

const Editor: NodeEditorV2<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = (editor) => {
  const canvasVisibilityOption = useCanvasVisibilityOption(
    editor.data.canvasVisibility,
    (canvasVisibility) => editor.onChange({ canvasVisibility }),
    LABELS_V2
  );

  const [isDragging, toggleDragging] = useToggle(false);

  const mapManager = useMapManager(editor.data.texts, (texts) => editor.onChange({ texts }), {
    clone: ({ id }, cloneData) => ({ ...cloneData, id }),
    factory: textFactory,
  });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={Documentation.TEXT_STEP}>
            <EditorV2.FooterActionsButton actions={[canvasVisibilityOption]} />

            <Button variant={Button.Variant.SECONDARY} onClick={() => mapManager.onAdd()} squareRadius flat>
              Add Variant
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
    >
      <DraggableList
        type="text-editor"
        canDrag={!mapManager.isOnlyItem}
        onEndDrag={toggleDragging}
        itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey }}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={EditorItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={EditorItem}
        withContextMenuDelete={!mapManager.isOnlyItem}
        withContextMenuDuplicate
      />
    </EditorV2>
  );
};

export default Editor;
