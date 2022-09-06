import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import NoMatchV2 from '@/pages/Canvas/managers/components/NoMatchV2';
import { useIfManager } from '@/pages/Canvas/managers/IfV2/hooks';

import IfItem from './IfItem';

const DRAG_TYPE = 'if-editor';

const IfRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts>();
  const mapManager = useIfManager();
  const noMatchConfig = NoMatchV2.useConfig({ canRemove: false });
  const [isDragging, toggleDragging] = useToggle(false);

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title="Condition" />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.CONDITION_STEP}>
          {!mapManager.isMaxReached && (
            <Button variant={Button.Variant.PRIMARY} onClick={() => mapManager.onAdd()} squareRadius>
              Add Condition
            </Button>
          )}
        </EditorV2.DefaultFooter>
      }
      dropLagAccept={DRAG_TYPE}
    >
      <DraggableList
        type={DRAG_TYPE}
        canDrag={!mapManager.isOnlyItem}
        itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey }}
        onEndDrag={toggleDragging}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={IfItem}
        partialDragItem
        deleteComponent={DeleteComponent}
        previewComponent={IfItem}
        withContextMenuDelete={!mapManager.isOnlyItem}
        withContextMenuDuplicate={!mapManager.isMaxReached}
      />

      {!isDragging && noMatchConfig.section}
    </EditorV2>
  );
};

export default IfRootEditor;
