import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, createUIOnlyMenuItemOption, useConst } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { HelpTooltip } from '@/components/IntentForm';
import { useManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useIntentScope } from '@/pages/Canvas/managers/hooks';

import { NoMatchV2, NoReplyV2 } from '../../../components';
import { DraggableItem } from './components';

const IntentEditor: React.FC<{ disableAnimation: boolean }> = ({ disableAnimation }) => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts>();
  const defaultSlots = useConst<Realtime.IntentSlot[]>([]);

  const [isDragging, toggleDragging] = useToggle(false);

  const onChangeSlots = React.useCallback(
    (slots: Realtime.IntentSlot[], save?: boolean) => editor.onChange({ intent: { slots } }, save),
    [editor.onChange]
  );

  const onSelectQueryType = React.useCallback(
    () => editor.onChange({ captureType: BaseNode.CaptureV2.CaptureType.QUERY, noMatch: null, intent: { slots: [] } }),
    [editor.onChange]
  );

  const managerAPI = useManager(editor.data.intent?.slots ?? defaultSlots, onChangeSlots, {
    factory: Realtime.Utils.slot.intentSlotFactoryCreator(editor.projectType),
    autosave: false,
  });

  const dynamicSelectedSlotIDs = React.useMemo(() => managerAPI.items.map((item) => item.id || ''), [managerAPI.items]);
  const selectedSlotIDs = React.useMemo(() => dynamicSelectedSlotIDs, [dynamicSelectedSlotIDs.join('')]);

  const noMatchConfig = NoMatchV2.useConfig();
  const noReplyConfig = NoReplyV2.useConfig();
  const intentScopeOption = useIntentScope({ data: editor.data, onChange: editor.onChange });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
            <EditorV2.FooterActionsButton
              actions={[intentScopeOption, createUIOnlyMenuItemOption('divider', { divider: true }), noMatchConfig.option, noReplyConfig.option]}
            />

            <Button variant={Button.Variant.PRIMARY} onClick={() => managerAPI.onAdd({ id: '' })} squareRadius>
              Add Capture
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
      disableAnimation={disableAnimation}
    >
      <DraggableList
        type="capture-v2-editor"
        onDelete={managerAPI.onRemove}
        onReorder={managerAPI.onReorder}
        itemProps={{ editor, latestCreatedKey: managerAPI.latestCreatedKey, onSelectQueryType, selectedSlotIDs }}
        onEndDrag={toggleDragging}
        mapManaged={managerAPI.mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        partialDragItem
        deleteComponent={DeleteComponent}
        previewComponent={DraggableItem}
        withContextMenuDelete
      />

      {!isDragging && (
        <>
          {noMatchConfig.section}
          {noReplyConfig.section}
        </>
      )}
    </EditorV2>
  );
};

export default IntentEditor;
