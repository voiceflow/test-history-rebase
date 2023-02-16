import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, createDividerMenuItemOption, SectionV2, useConst } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import * as ProjectV2 from '@/ducks/projectV2';
import { useActiveProjectTypeConfig, useMapManager, useSelector, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useIntentScope } from '@/pages/Canvas/managers/hooks';

import { Actions, NoMatchV2, NoReplyV2 } from '../../../components';
import { useUtterancesOption } from '../hooks';
import { DraggableItem } from './components';

const ITEM_DRAG_TYPE = 'capture-v2-editor';

const NO_UTTERANCES_PLATFORMS: Set<Platform.Constants.PlatformType> = new Set([
  Platform.Constants.PlatformType.GOOGLE,
  Platform.Constants.PlatformType.DIALOGFLOW_CX,
  Platform.Constants.PlatformType.DIALOGFLOW_ES,
]);

const IntentEditor: React.FC<{ disableAnimation: boolean }> = ({ disableAnimation }) => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts>();
  const projectConfig = useActiveProjectTypeConfig();
  const platform = useSelector(ProjectV2.active.platformSelector);

  const defaultSlots = useConst<Platform.Base.Models.Intent.Slot[]>([]);

  const [isDragging, toggleDragging] = useToggle(false);

  const onSelectQueryType = React.useCallback(
    () => editor.onChange({ intent: { slots: [] }, noMatch: null, captureType: BaseNode.CaptureV2.CaptureType.QUERY }),
    [editor.onChange]
  );

  const mapManager = useMapManager(editor.data.intent?.slots ?? defaultSlots, (slots) => editor.onChange({ intent: { slots } }), {
    factory: () => projectConfig.utils.intent.slotFactory({ id: '' }),
    clone: ({ id }, cloneData) => ({ ...cloneData, id }),
  });

  const dynamicSelectedSlotIDs = React.useMemo(() => mapManager.items.map((item) => item.id || ''), [mapManager.items]);
  const selectedSlotIDs = React.useMemo(() => dynamicSelectedSlotIDs, [dynamicSelectedSlotIDs.join('')]);

  const showUtteranceOption = (platform: Platform.Constants.PlatformType) => !NO_UTTERANCES_PLATFORMS.has(platform);

  const noMatchConfig = NoMatchV2.useConfig({ step: editor.data });
  const noReplyConfig = NoReplyV2.useConfig({ step: editor.data });
  const intentScopeOption = useIntentScope({ data: editor.data, onChange: editor.onChange });
  const utterancesOption = useUtterancesOption(editor.data.utterancesShown || false, editor.onChange);

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={Documentation.CAPTURE_STEP}>
            <EditorV2.FooterActionsButton
              actions={[
                intentScopeOption,
                showUtteranceOption(platform) ? utterancesOption : null,
                createDividerMenuItemOption(),
                noMatchConfig.option,
                noReplyConfig.option,
              ]}
            />

            <Button variant={Button.Variant.PRIMARY} onClick={() => mapManager.onAdd()} squareRadius>
              Add Capture
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
      dropLagAccept={[Actions.Section.DRAG_TYPE, ITEM_DRAG_TYPE]}
      disableAnimation={disableAnimation}
    >
      <DraggableList
        type={ITEM_DRAG_TYPE}
        canDrag={!mapManager.isOnlyItem}
        itemProps={{
          editor,
          selectedSlotIDs,
          latestCreatedKey: mapManager.latestCreatedKey,
          onSelectQueryType,
        }}
        onEndDrag={toggleDragging}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        partialDragItem
        deleteComponent={DeleteComponent}
        previewComponent={DraggableItem}
        withContextMenuDelete={!mapManager.isOnlyItem}
        withContextMenuDuplicate
      />

      {!isDragging && (
        <>
          <SectionV2.Divider />

          <Actions.Section portID={editor.node.ports.out.builtIn[BaseModels.PortType.NEXT]} editor={editor} />

          {noMatchConfig.section}

          {noReplyConfig.section}
        </>
      )}
    </EditorV2>
  );
};

export default IntentEditor;
