import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { DialogType } from '@/constants';
import { useMapManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useCanvasVisibilityOption } from '@/pages/Canvas/managers/hooks';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { audioFactory, getLabelByType, voiceFactory } from '../constants';
import EditorItem from './EditorItem';
import { isVoiceItem } from './utils';

const DRAG_TYPE = 'speak-editor';

const Editor: NodeEditorV2<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts> = (editor) => {
  const canvasVisibilityOption = useCanvasVisibilityOption(editor.data.canvasVisibility, (canvasVisibility) => editor.onChange({ canvasVisibility }));
  const [isDragging, toggleDragging] = useToggle(false);

  const isVoiceEditor = isVoiceItem(editor.data.dialogs[0]);

  const mapManager = useMapManager(editor.data.dialogs, (dialogs) => editor.onChange({ dialogs }), {
    clone: (data, cloneData) =>
      isVoiceItem(cloneData)
        ? { ...data, voice: cloneData.voice, content: cloneData.content }
        : { ...data, url: cloneData.url, desc: cloneData.desc },

    factory: isVoiceEditor ? voiceFactory : audioFactory,
  });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title={getLabelByType(isVoiceEditor ? DialogType.VOICE : DialogType.AUDIO)} />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={isVoiceEditor ? Documentation.SPEAK_STEP : Documentation.AUDIO_STEP}>
            <EditorV2.FooterActionsButton actions={[canvasVisibilityOption]} />

            <Button variant={Button.Variant.SECONDARY} onClick={() => mapManager.onAdd()} squareRadius flat>
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
