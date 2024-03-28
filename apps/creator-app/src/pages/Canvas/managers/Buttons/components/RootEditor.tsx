import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, createDividerMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useMapManager, useToggle } from '@/hooks';
import { useLocalStorageState } from '@/hooks/storage.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useButtonLayoutOption, useIntentScope } from '@/pages/Canvas/managers/hooks';

import { Actions, ListeningForIntentSection, NoMatchV2, NoReplyV2 } from '../../components';
import { ADD_INTENTS_KEY, buttonFactory } from '../constants';
import DraggableItem from './DraggableItem';

const ITEM_DRAG_TYPE = 'buttons-editor';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts>();
  const dynamicPortsSync = EditorV2.useSyncDynamicPorts();

  const [isDragging, toggleDragging] = useToggle(false);

  const onUpdateButtons = React.useCallback((buttons: BaseNode.Buttons.Button[]) => editor.onChange({ buttons }), [editor.onChange]);

  const mapManager = useMapManager(editor.data.buttons, onUpdateButtons, {
    ...dynamicPortsSync,
    clone: ({ id }, cloneData) => ({ ...cloneData, id }),
    getKey: (button) => button.id,
    factory: buttonFactory,
  });

  const noMatchConfig = NoMatchV2.useConfig({ step: editor.data });
  const noReplyConfig = NoReplyV2.useConfig({ step: editor.data });
  const intentScopeOption = useIntentScope({ data: editor.data, onChange: editor.onChange });
  const buttonLayoutOption = useButtonLayoutOption();

  const [canAddIntent, setCanAddIntent] = useLocalStorageState(ADD_INTENTS_KEY, true);
  const addIntentsOption = React.useMemo(
    () => ({
      label: canAddIntent ? 'Remove intents for buttons' : 'Add intents for buttons',
      onClick: () => setCanAddIntent(!canAddIntent),
    }),
    [canAddIntent]
  );

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
                createDividerMenuItemOption(),
                noMatchConfig.option,
                noReplyConfig.option,
                addIntentsOption,
              ]}
            />

            <Button variant={Button.Variant.PRIMARY} onClick={() => mapManager.onAdd()} squareRadius>
              Add Button
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
          itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey, canAddIntent, itemCount: mapManager.size }}
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
          {noMatchConfig.section}
          {noReplyConfig.section}
        </>
      )}
    </EditorV2>
  );
};

export default RootEditor;
