import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useMapManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useCanvasVisibilityOption } from '@/pages/Canvas/managers/hooks';
import { audioFactory } from '@/pages/Canvas/managers/Speak/constants';

import AudioItem from './components/AudioItem';

const DRAG_TYPE = 'speak-audio-editor';

const AudioEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts>();
  const audios = editor.data.dialogs as Realtime.AudioData[];
  const canvasVisibilityOption = useCanvasVisibilityOption(editor.data.canvasVisibility, (canvasVisibility) => editor.onChange({ canvasVisibility }));
  const [isDragging, toggleDragging] = useToggle(false);

  const mapManager = useMapManager(audios, (dialogs) => editor.onChange({ dialogs }), {
    clone: (data, cloneData) => ({ ...data, url: cloneData.url, desc: cloneData.desc }),
    factory: audioFactory,
  });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title="Audio" />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={Documentation.AUDIO_STEP}>
            <EditorV2.FooterActionsButton actions={[canvasVisibilityOption]} />

            <Button variant={Button.Variant.PRIMARY} onClick={() => mapManager.onAdd()} squareRadius>
              Add Variant
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
      dropLagAccept={DRAG_TYPE}
    >
      <DraggableList
        type={DRAG_TYPE}
        canDrag={!mapManager.isOnlyItem}
        onEndDrag={toggleDragging}
        itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey }}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={AudioItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={AudioItem}
        withContextMenuDelete={!mapManager.isOnlyItem}
        withContextMenuDuplicate
      />
    </EditorV2>
  );
};

export default AudioEditor;
