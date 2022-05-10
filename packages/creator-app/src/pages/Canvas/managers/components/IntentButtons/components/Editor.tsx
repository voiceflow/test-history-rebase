import { BaseButton } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, createUIOnlyMenuItemOption } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as IntentV2 from '@/ducks/intentV2';
import { useManager, useSelector, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useButtonLayoutOption } from '@/pages/Canvas/managers/hooks';
import { intentButtonFactory } from '@/utils/intent';
import { getPlatformValue } from '@/utils/platform';

import DraggableItem from './DraggableItem';
import HelpTooltip from './HelpTooltip';

interface Data {
  buttons: BaseButton.AnyButton[];
  choices?: Realtime.NodeData.InteractionChoice[];
}

const Editor: React.FC = () => {
  const editor = EditorV2.useEditor<Data>();

  const { buttons, choices } = editor.data;

  const [isDragging, toggleDragging] = useToggle(false);

  const intents = useSelector(IntentV2.allPlatformIntentsSelector);

  const onChangeButtons = React.useCallback((buttons: BaseButton.AnyButton[]) => editor.onChange({ buttons }), [editor.onChange]);

  const managedAPI = useManager(buttons, onChangeButtons, {
    factory: intentButtonFactory,
  });

  const intentOptions = React.useMemo(() => {
    const usedIntentIDs = choices?.map((choice) => choice.intent).filter(Utils.array.isNotNullish) ?? [];
    const usedIntents = intents.filter((intent) => usedIntentIDs.includes(intent.id));
    const unusedIntents = intents.filter((intent) => !usedIntentIDs.includes(intent.id));

    return [...(usedIntents.length ? [...usedIntents, createUIOnlyMenuItemOption('divider', { divider: true })] : []), ...unusedIntents];
  }, [intents, choices]);

  const label = getPlatformValue(editor.platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons');

  const buttonLayoutOption = useButtonLayoutOption();

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader onBack={editor.goBack} />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={{ title: label, content: <HelpTooltip label={label} /> }}>
            <EditorV2.FooterActionsButton actions={[buttonLayoutOption]} placement="bottom-end" />

            <Button variant={Button.Variant.PRIMARY} onClick={() => managedAPI.onAdd()} squareRadius>
              Add {getPlatformValue(editor.platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'Chip' }, 'Button')}
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
    >
      <DraggableList
        type="buttons-editor"
        onDelete={managedAPI.onRemove}
        onReorder={managedAPI.onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ editor, latestCreatedKey: managedAPI.latestCreatedKey, intentOptions }}
        mapManaged={managedAPI.mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
        withContextMenuDelete
      />
    </EditorV2>
  );
};

export default EditorV2.withRedirectToRoot<Data>((editor) => !editor.data.buttons)(Editor);
