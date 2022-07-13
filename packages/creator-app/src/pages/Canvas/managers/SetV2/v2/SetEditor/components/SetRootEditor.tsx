import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Input, SectionV2, useLinkedState, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useMapManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { MAX_SETS } from '../../../constants';
import { setFactory } from '../../../utils';
import SetItem from './SetItem';

const DRAG_TYPE = 'set-editor';

const SetRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts>();
  const [stepName, setStepName] = useLinkedState(editor.data.title);
  const [isDragging, toggleDragging] = useToggle(false);

  const mapManager = useMapManager(editor.data.sets, (sets) => editor.onChange({ sets }), {
    clone: ({ id }, cloneData) => ({ ...cloneData, id }),
    factory: setFactory,
    maxItems: MAX_SETS,
  });

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
      dropLagAccept={DRAG_TYPE}
    >
      <SectionV2.SimpleSection>
        <Input
          value={stepName}
          onBlur={() => editor.onChange({ title: stepName })}
          placeholder="Enter set label"
          onEnterPress={withInputBlur()}
          onChangeText={setStepName}
        />
      </SectionV2.SimpleSection>

      <SectionV2.Divider />

      <DraggableList
        type={DRAG_TYPE}
        canDrag={!mapManager.isOnlyItem}
        itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey }}
        onEndDrag={toggleDragging}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={SetItem}
        partialDragItem
        deleteComponent={DeleteComponent}
        previewComponent={SetItem}
        withContextMenuDelete={!mapManager.isOnlyItem}
        withContextMenuDuplicate={!mapManager.isMaxReached}
      />
    </EditorV2>
  );
};

export default SetRootEditor;
