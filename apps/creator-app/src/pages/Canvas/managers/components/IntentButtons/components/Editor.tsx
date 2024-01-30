import { BaseButton } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, createDividerMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { Designer } from '@/ducks';
import { useMapManager, useToggle } from '@/hooks';
import { useSelector } from '@/hooks/store.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import useButtonLayoutOption from '@/pages/Canvas/managers/hooks/useButtonLayoutOption';
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

  const intents = useSelector(Designer.Intent.selectors.allWithFormattedBuiltInNames);

  const mapManager = useMapManager(buttons, (buttons) => editor.onChange({ buttons }), {
    factory: intentButtonFactory,
  });

  const intentOptions = React.useMemo(() => {
    const usedIntentIDs = choices?.map((choice) => choice.intent).filter(Utils.array.isNotNullish) ?? [];
    const usedIntents = Utils.array.inferUnion(intents).filter((intent) => usedIntentIDs.includes(intent.id));
    const unusedIntents = Utils.array.inferUnion(intents).filter((intent) => !usedIntentIDs.includes(intent.id));

    return [...(usedIntents.length ? [...usedIntents, createDividerMenuItemOption()] : []), ...unusedIntents];
  }, [intents, choices]);

  const label = getPlatformValue(editor.platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons');

  const buttonLayoutOption = useButtonLayoutOption();

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader onBack={editor.goBack} />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={{ title: label, content: <HelpTooltip label={label} /> }}>
            <EditorV2.FooterActionsButton actions={[buttonLayoutOption]} placement="bottom-end" />

            <Button variant={Button.Variant.PRIMARY} onClick={() => mapManager.onAdd()} squareRadius>
              Add {getPlatformValue(editor.platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chip' }, 'Button')}
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
    >
      <DraggableList
        type="buttons-editor"
        onEndDrag={toggleDragging}
        itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey, intentOptions }}
        mapManager={mapManager}
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
