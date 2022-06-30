import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { useManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { LABELS_V2, useCanvasVisibilityOption } from '@/pages/Canvas/managers/hooks';
import { textFactory } from '@/pages/Canvas/managers/Text/constants';

import HelpTooltip from './components/HelpTooltip';
import TextItem from './components/TextItem';

const TextRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts>();
  const canvasVisibilityOption = useCanvasVisibilityOption(
    editor.data.canvasVisibility,
    (canvasVisibility) => editor.onChange({ canvasVisibility }),
    LABELS_V2
  );
  const { onAdd, onReorder, onRemove } = EditorV2.useSyncDynamicPorts();
  const [isDragging, toggleDragging] = useToggle(false);

  const managerAPI = useManager(editor.data.texts, (texts) => editor.onChange({ texts }), {
    onAdd,
    factory: textFactory,
    onRemove,
    onReorder,
  });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
            <EditorV2.FooterActionsButton actions={[canvasVisibilityOption]} />

            <Button variant={Button.Variant.PRIMARY} onClick={() => managerAPI.onAdd()} squareRadius>
              Add Variant
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
    >
      <DraggableList
        type="text-editor"
        onDelete={managerAPI.onRemove}
        onReorder={managerAPI.onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ editor, latestCreatedKey: managerAPI.latestCreatedKey }}
        mapManaged={managerAPI.mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={TextItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={TextItem}
        withContextMenuDelete
      />
    </EditorV2>
  );
};

export default TextRootEditor;
