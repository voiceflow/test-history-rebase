import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent, MapManagedEditActionHandler } from '@/components/DraggableList';
import { useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import HelpTooltip from '@/pages/Canvas/managers/SetV2/components/HelpTooltip';
import { MAX_SETS } from '@/pages/Canvas/managers/SetV2/constants';
import { useSetManager, useSetTitleForm } from '@/pages/Canvas/managers/SetV2/hooks';

import SetItem from './SetItem';

const SetRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts>();
  const managerAPI = useSetManager();
  const { inputRef, stepName, setStepName } = useSetTitleForm(editor.data.title);
  const [isDragging, toggleDragging] = useToggle(false);
  const canCreateMoreItems = managerAPI.items.length < MAX_SETS;

  const onDuplicate: MapManagedEditActionHandler<Realtime.NodeData.SetExpressionV2> = (_, item) => {
    managerAPI.onDuplicate(item.index, { ...item, ...item.item });
  };

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
            {canCreateMoreItems && (
              <Button variant={Button.Variant.PRIMARY} onClick={() => managerAPI.onAdd()} squareRadius>
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
        itemProps={{ editor, latestCreatedKey: managerAPI.latestCreatedKey }}
        itemComponent={SetItem}
        previewComponent={SetItem}
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
    </EditorV2>
  );
};

export default SetRootEditor;
