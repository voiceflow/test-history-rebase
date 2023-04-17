import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, createDividerMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useMapManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useIntentScope } from '@/pages/Canvas/managers/hooks';

import { Actions, IntentButtons, ListeningForIntentSection, NoMatchV2, NoReplyV2 } from '../../components';
import { choiceFactory } from '../constants';
import DraggableItem from './DraggableItem';

const ITEM_DRAG_TYPE = 'interaction-editor';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts>();
  const syncDynamicPorts = EditorV2.useSyncDynamicPorts();

  const [isDragging, toggleDragging] = useToggle(false);

  const mapManager = useMapManager(editor.data.choices, (choices) => editor.onChange({ choices }), {
    ...syncDynamicPorts,
    clone: ({ id }, cloneData) => ({ ...cloneData, id, intent: null }),
    factory: choiceFactory,
  });

  const noMatchConfig = NoMatchV2.useConfig({ step: editor.data });
  const noReplyConfig = NoReplyV2.useConfig({ step: editor.data });
  const buttonsConfig = IntentButtons.useConfig();
  const intentScopeOption = useIntentScope({ data: editor.data, onChange: editor.onChange });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={Documentation.CHOICE_STEP}>
            <EditorV2.FooterActionsButton
              actions={[intentScopeOption, createDividerMenuItemOption(), buttonsConfig.option, noMatchConfig.option, noReplyConfig.option]}
            />

            <Button variant={Button.Variant.PRIMARY} onClick={() => mapManager.onAdd()} squareRadius>
              Add Choice
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
      dropLagAccept={[Actions.Section.DRAG_TYPE, ITEM_DRAG_TYPE]}
    >
      {!mapManager.size ? (
        <ListeningForIntentSection />
      ) : (
        <DraggableList
          type={ITEM_DRAG_TYPE}
          onEndDrag={toggleDragging}
          itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey }}
          mapManager={mapManager}
          onStartDrag={toggleDragging}
          itemComponent={DraggableItem}
          deleteComponent={DeleteComponent}
          partialDragItem
          previewComponent={DraggableItem}
          withContextMenuDelete
          withContextMenuDuplicate
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
