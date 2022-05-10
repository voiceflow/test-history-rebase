import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, createUIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { HelpTooltip } from '@/components/IntentForm';
import { useManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useIntentScope } from '@/pages/Canvas/managers/hooks';

import { IntentButtons, ListeningForIntentSection, NoMatchV2, NoReplyV2 } from '../../components';
import { choiceFactory } from '../constants';
import DraggableItem from './DraggableItem';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts>();

  const [isDragging, toggleDragging] = useToggle(false);

  const onUpdateChoices = React.useCallback(
    (choices: Realtime.NodeData.InteractionChoice[], save?: boolean) => editor.onChange({ choices }, save),
    [editor.onChange]
  );

  const onAdd = React.useCallback(() => editor.engine.port.addDynamic(editor.nodeID), [editor.engine.port, editor.nodeID]);

  const onReorder = React.useCallback(
    (from: number, to: number) => editor.engine.port.reorderDynamic(editor.nodeID, from, to),
    [editor.engine.port, editor.nodeID]
  );

  const onRemove = React.useCallback(
    (_: unknown, index: number) => editor.engine.port.removeDynamic(editor.node.ports.out.dynamic[index]),
    [editor.engine.port, editor.node.ports.out.dynamic]
  );

  const managerAPI = useManager(editor.data.choices, onUpdateChoices, {
    onAdd,
    factory: choiceFactory,
    autosave: false,
    onRemove,
    onReorder,
  });

  const noMatchConfig = NoMatchV2.useConfig();
  const noReplyConfig = NoReplyV2.useConfig();
  const buttonsConfig = IntentButtons.useConfig();
  const intentScopeOption = useIntentScope({ data: editor.data, onChange: editor.onChange });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
            <EditorV2.FooterActionsButton
              actions={[
                intentScopeOption,
                createUIOnlyMenuItemOption('divider', { divider: true }),
                buttonsConfig.option,
                noMatchConfig.option,
                noReplyConfig.option,
              ]}
            />

            <Button variant={Button.Variant.PRIMARY} onClick={() => managerAPI.onAdd()} squareRadius>
              Add Choice
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
    >
      {!editor.data.choices.length ? (
        <ListeningForIntentSection />
      ) : (
        <DraggableList
          type="interaction-editor"
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
          {buttonsConfig.section}
          {noMatchConfig.section}
          {noReplyConfig.section}
        </>
      )}
    </EditorV2>
  );
};

export default RootEditor;
