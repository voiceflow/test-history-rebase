import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useCanvasVisibilityOption } from '@/pages/Canvas/managers/hooks';
import { audioFactory } from '@/pages/Canvas/managers/Speak/constants';

import AudioItem from './components/AudioItem';

const AudioEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts>();
  const audios = editor.data.dialogs as Realtime.AudioData[];
  const canvasVisibilityOption = useCanvasVisibilityOption(editor.data.canvasVisibility, (canvasVisibility) => editor.onChange({ canvasVisibility }));
  const { onAdd, onReorder, onRemove } = EditorV2.useSyncDynamicPorts();
  const [isDragging, toggleDragging] = useToggle(false);

  const managerAPI = useManager<Realtime.AudioData, Realtime.AudioData[]>(audios, (dialogs) => editor.onChange({ dialogs }), {
    onAdd,
    factory: audioFactory,
    onRemove,
    onReorder,
  });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title="Audio" />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={Documentation.AUDIO_STEP}>
            <EditorV2.FooterActionsButton actions={[canvasVisibilityOption]} />

            <Button variant={Button.Variant.PRIMARY} onClick={() => managerAPI.onAdd()} squareRadius>
              Add Variant
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
    >
      <DraggableList
        type="speak-audio-editor"
        onDelete={managerAPI.onRemove}
        onReorder={managerAPI.onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ editor, latestCreatedKey: managerAPI.latestCreatedKey }}
        mapManaged={managerAPI.mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={AudioItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={AudioItem}
        withContextMenuDelete
      />
    </EditorV2>
  );
};

export default AudioEditor;
