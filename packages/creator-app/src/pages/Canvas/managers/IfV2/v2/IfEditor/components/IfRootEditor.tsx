import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent, MapManagedEditActionHandler } from '@/components/DraggableList';
import { useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import NoMatchV2 from '@/pages/Canvas/managers/components/NoMatchV2';
import HelpTooltip from '@/pages/Canvas/managers/IfV2/components/HelpTooltip';
import { expressionFactory, MAX_IF_ITEMS } from '@/pages/Canvas/managers/IfV2/constants';
import { useIfManager } from '@/pages/Canvas/managers/IfV2/hooks';

import IfItem from './IfItem';

const IfRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts>();
  const managerAPI = useIfManager();
  const noMatchConfig = NoMatchV2.useConfig();
  const [isDragging, toggleDragging] = useToggle(false);
  const canCreateMoreItems = managerAPI.items.length < MAX_IF_ITEMS;

  const onDuplicate: MapManagedEditActionHandler<Realtime.ExpressionData> = (_, item) => {
    managerAPI.onDuplicate(item.index, item.item as any);
  };

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title="Condition" />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
          {canCreateMoreItems && (
            <Button variant={Button.Variant.PRIMARY} onClick={() => managerAPI.onAdd(expressionFactory())} squareRadius>
              Add Condition
            </Button>
          )}
        </EditorV2.DefaultFooter>
      }
    >
      <DraggableList
        type="if-editor"
        itemProps={{ editor, latestCreatedKey: managerAPI.latestCreatedKey }}
        itemComponent={IfItem as any}
        previewComponent={IfItem as any}
        deleteComponent={DeleteComponent}
        partialDragItem
        withContextMenuDelete
        withContextMenuDuplicate={canCreateMoreItems}
        onEndDrag={toggleDragging}
        onStartDrag={toggleDragging}
        mapManaged={managerAPI.mapManaged}
        onDuplicate={onDuplicate}
        onDelete={managerAPI.onRemove}
        onReorder={managerAPI.onReorder}
      />

      {!isDragging && noMatchConfig.section}
    </EditorV2>
  );
};

export default IfRootEditor;
