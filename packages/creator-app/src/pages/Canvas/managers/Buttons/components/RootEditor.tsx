import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, createUIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useButtonLayoutOption, useIntentScope } from '@/pages/Canvas/managers/hooks';

import { ListeningForIntentSection, NoMatchV2, NoReplyV2 } from '../../components';
import { buttonFactory } from '../constants';
import DraggableItem from './DraggableItem';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts>();
  const { onAdd, onReorder, onRemove } = EditorV2.useSyncDynamicPorts();

  const [isDragging, toggleDragging] = useToggle(false);

  const onUpdateButtons = React.useCallback(
    (buttons: BaseNode.Buttons.Button[], save?: boolean) => editor.onChange({ buttons }, save),
    [editor.onChange]
  );

  const managerAPI = useManager(editor.data.buttons, onUpdateButtons, {
    onAdd,
    factory: buttonFactory,
    onRemove,
    onReorder,
  });

  const noMatchConfig = NoMatchV2.useConfig();
  const noReplyConfig = NoReplyV2.useConfig();
  const intentScopeOption = useIntentScope({ data: editor.data, onChange: editor.onChange });
  const buttonLayoutOption = useButtonLayoutOption();

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={Documentation.BUTTONS_STEP}>
            <EditorV2.FooterActionsButton
              actions={[
                buttonLayoutOption,
                intentScopeOption,
                createUIOnlyMenuItemOption('divider', { divider: true }),
                noMatchConfig.option,
                noReplyConfig.option,
              ]}
            />

            <Button variant={Button.Variant.PRIMARY} onClick={() => managerAPI.onAdd()} squareRadius>
              Add Button
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
    >
      {!editor.data.buttons.length ? (
        <ListeningForIntentSection />
      ) : (
        <DraggableList
          type="buttons-editor"
          onDelete={managerAPI.onRemove}
          onReorder={managerAPI.onReorder}
          onEndDrag={toggleDragging}
          itemProps={{ editor, latestCreatedKey: managerAPI.latestCreatedKey }}
          mapManaged={managerAPI.mapManaged}
          onStartDrag={toggleDragging}
          itemComponent={DraggableItem}
          deleteComponent={DeleteComponent}
          partialDragItem
          previewComponent={DraggableItem}
          withContextMenuDelete
        />
      )}

      {!isDragging && (
        <>
          {noMatchConfig.section}
          {noReplyConfig.section}
        </>
      )}
    </EditorV2>
  );
};

export default RootEditor;
