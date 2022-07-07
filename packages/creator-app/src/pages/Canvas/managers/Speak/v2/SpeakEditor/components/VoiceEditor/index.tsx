import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent, MapManagedEditActionHandler } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useCanvasVisibilityOption } from '@/pages/Canvas/managers/hooks';
import { voiceFactory } from '@/pages/Canvas/managers/Speak/constants';

import { VoiceItem } from './components';

const clone = (data: Realtime.SSMLData, cloneData: Realtime.SSMLData): Realtime.SSMLData => ({
  ...data,
  voice: cloneData.voice,
  content: cloneData.content,
});

const VoiceEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts>();
  const { onAdd, onReorder, onRemove } = EditorV2.useSyncDynamicPorts();

  const [isDragging, toggleDragging] = useToggle(false);

  const dialogs = editor.data.dialogs as Realtime.SSMLData[];

  const managerAPI = useManager<Realtime.SSMLData, Realtime.SSMLData[]>(dialogs, (dialogs) => editor.onChange({ dialogs }), {
    onAdd,
    clone,
    factory: voiceFactory,
    onRemove,
    onReorder,
  });

  const onDuplicate = usePersistFunction<MapManagedEditActionHandler<Realtime.SSMLData>>((_, item) => {
    managerAPI.onDuplicate(item.index, item.item);
  });

  const canvasVisibilityOption = useCanvasVisibilityOption(editor.data.canvasVisibility, (canvasVisibility) => editor.onChange({ canvasVisibility }));

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={Documentation.SPEAK_STEP}>
            <EditorV2.FooterActionsButton actions={[canvasVisibilityOption]} />

            <Button variant={Button.Variant.PRIMARY} onClick={() => managerAPI.onAdd()} squareRadius>
              Add Variant
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
      dropLagAccept="speak-voice-editor"
    >
      <DraggableList
        type="speak-voice-editor"
        onDelete={managerAPI.onRemove}
        onReorder={managerAPI.onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ editor, latestCreatedKey: managerAPI.latestCreatedKey }}
        mapManaged={managerAPI.mapManaged}
        onDuplicate={onDuplicate}
        onStartDrag={toggleDragging}
        itemComponent={VoiceItem}
        deleteComponent={managerAPI.size > 1 ? DeleteComponent : undefined}
        partialDragItem
        previewComponent={VoiceItem}
        withContextMenuDelete={managerAPI.size > 1}
        contextMenuSelfDismiss
        withContextMenuDuplicate
      />
    </EditorV2>
  );
};

export default VoiceEditor;
