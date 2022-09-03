import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useMapManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import useCanvasVisibilityOption from '@/pages/Canvas/managers/hooks/useCanvasVisibilityOption';
import { voiceFactory } from '@/pages/Canvas/managers/Speak/constants';

import { VoiceItem } from './components';

const DRAG_TYPE = 'speak-voice-editor';

const VoiceEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts>();

  const [isDragging, toggleDragging] = useToggle(false);

  const dialogs = editor.data.dialogs as Realtime.SSMLData[];

  const mapManager = useMapManager(dialogs, (dialogs) => editor.onChange({ dialogs }), {
    clone: (data, cloneData) => ({ ...data, voice: cloneData.voice, content: cloneData.content }),
    factory: voiceFactory,
  });

  const canvasVisibilityOption = useCanvasVisibilityOption(editor.data.canvasVisibility, (canvasVisibility) => editor.onChange({ canvasVisibility }));

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={Documentation.SPEAK_STEP}>
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
        itemComponent={VoiceItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={VoiceItem}
        withContextMenuDelete={!mapManager.isOnlyItem}
        withContextMenuDuplicate
      />
    </EditorV2>
  );
};

export default VoiceEditor;
