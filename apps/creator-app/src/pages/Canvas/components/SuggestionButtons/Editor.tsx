import { BaseButton } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createDividerMenuItemOption } from '@voiceflow/ui';
import React from 'react';
import { createSelector } from 'reselect';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import OverflowMenu from '@/components/OverflowMenu';
import * as Creator from '@/ducks/creator';
import * as IntentV2 from '@/ducks/intentV2';
import { useActiveProjectPlatform, useMapManager, useSelector, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { useUpdateData } from '@/pages/Canvas/components/EditorSidebar/hooks';
import useButtonLayoutOption from '@/pages/Canvas/managers/hooks/useButtonLayoutOption';
import { getPlatformValue } from '@/utils/platform';

import HelpTooltip from './HelpTooltip';
import Item from './Item';

const focusedNodeWithButtonsSelector = createSelector(
  Creator.focusedNodeDataSelector,
  (data) => data as Realtime.NodeData<{ buttons?: BaseButton.AnyButton[]; choices?: Realtime.NodeData.InteractionChoice[] }>
);

const Editor: React.FC = () => {
  const focus = useSelector(Creator.creatorFocusSelector);
  const intents = useSelector(IntentV2.allPlatformIntentsSelector);
  const focusedNode = useSelector(focusedNodeWithButtonsSelector);

  const platform = useActiveProjectPlatform();
  const [isDragging, toggleDragging] = useToggle(false);
  const updateData = useUpdateData(focus.target || undefined);
  const updateButtons = React.useCallback((buttons: BaseButton.AnyButton[]) => updateData({ buttons }), [updateData]);
  const buttonLayoutOption = useButtonLayoutOption();

  const mapManager = useMapManager(focusedNode?.buttons ?? [], updateButtons, {
    factory: () => ({
      name: '',
      type: BaseButton.ButtonType.INTENT,
      payload: { intentID: null },
    }),
  });

  const usedIntentIDs = React.useMemo(
    () => (focusedNode?.choices?.map((choice) => choice.intent).filter(Boolean) as string[]) ?? [],
    [platform, focusedNode?.choices]
  );
  const dividedIntents = React.useMemo(() => {
    const usedIntents = intents.filter((intent) => usedIntentIDs.includes(intent.id));
    const unusedIntents = intents.filter((intent) => !usedIntentIDs.includes(intent.id));

    return [...(usedIntents.length ? [...usedIntents, createDividerMenuItemOption()] : []), ...unusedIntents];
  }, [intents, usedIntentIDs]);

  return (
    <Content
      anchor="How It Works"
      footer={({ scrollToBottom }) => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[buttonLayoutOption]} />}
          options={[
            {
              label: `Add ${getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chip' }, 'Button')}`,
              onClick: Utils.functional.chainVoidAsync(mapManager.onAdd, scrollToBottom),
            },
          ]}
          tutorial={{ content: <HelpTooltip /> }}
          tutorialTitle={getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons')}
        />
      )}
      hideFooter={isDragging}
    >
      <DraggableList
        type="buttons-editor"
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey: mapManager.latestCreatedKey, isOnlyItem: mapManager.isOnlyItem, dividedIntents }}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={Item}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={Item}
        withContextMenuDelete
      />
    </Content>
  );
};

export default Editor;
