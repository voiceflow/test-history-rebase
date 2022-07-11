import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useSetManager, useSetTitleForm } from '@/pages/Canvas/managers/SetV2/hooks';

import SetItem from './SetItem';

const SetRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts>();
  const mapManager = useSetManager();
  const { inputRef, stepName, setStepName } = useSetTitleForm(editor.data.title);
  const [isDragging, toggleDragging] = useToggle(false);

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={Documentation.SET_STEP}>
            {!mapManager.isMaxReached && (
              <Button variant={Button.Variant.PRIMARY} onClick={() => mapManager.onAdd()} squareRadius>
                Add Set
              </Button>
            )}
          </EditorV2.DefaultFooter>
        )
      }
    >
      <SectionV2.SimpleSection headerProps={{ py: 24 }}>
        <Input
          ref={inputRef}
          value={stepName}
          placeholder="Enter set label"
          onBlur={() => editor.onChange({ title: stepName })}
          onChangeText={setStepName}
        />
      </SectionV2.SimpleSection>

      <SectionV2.Divider />

      <DraggableList
        type="set-editor"
        itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey }}
        onEndDrag={toggleDragging}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={SetItem}
        partialDragItem
        deleteComponent={DeleteComponent}
        previewComponent={SetItem}
        withContextMenuDelete
        withContextMenuDuplicate={!mapManager.isMaxReached}
      />
    </EditorV2>
  );
};

export default SetRootEditor;
