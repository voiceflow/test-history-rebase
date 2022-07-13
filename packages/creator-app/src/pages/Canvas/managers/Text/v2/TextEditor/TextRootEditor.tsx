import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useMapManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { LABELS_V2, useCanvasVisibilityOption } from '@/pages/Canvas/managers/hooks';
import { textFactory } from '@/pages/Canvas/managers/Text/constants';

import TextItem from './components/TextItem';

const TextRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts>();
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

            <Button variant={Button.Variant.PRIMARY} onClick={() => mapManager.onAdd()} squareRadius>
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
        itemComponent={TextItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={TextItem}
        withContextMenuDelete={!mapManager.isOnlyItem}
        withContextMenuDuplicate
      />
    </EditorV2>
  );
};

export default TextRootEditor;
