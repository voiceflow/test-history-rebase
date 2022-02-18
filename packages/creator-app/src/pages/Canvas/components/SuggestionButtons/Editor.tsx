import { BaseButton } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createUIOnlyMenuItemOption } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { createSelector } from 'reselect';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import OverflowMenu from '@/components/OverflowMenu';
import { DistinctPlatform } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as IntentV2 from '@/ducks/intentV2';
import { connect } from '@/hocs';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { useUpdateData } from '@/pages/Canvas/components/EditorSidebar/hooks';
import { useButtonLayoutOption } from '@/pages/Canvas/managers/hooks';
import { PlatformContext } from '@/pages/Project/contexts';
import { ConnectedProps } from '@/types';
import { getDistinctPlatformValue, getPlatformValue } from '@/utils/platform';

import HelpTooltip from './HelpTooltip';
import Item from './Item';

const Editor: React.FC<ConnectedButtonPageProps> = ({ focus, intents, focusedNode }) => {
  const platform = React.useContext(PlatformContext)!;
  const [isDragging, toggleDragging] = useToggle(false);
  const updateData = useUpdateData(focus.target || undefined);
  const updateButtons = React.useCallback((buttons: BaseButton.AnyButton[]) => updateData({ buttons }), [updateData]);
  const buttonLayoutOption = useButtonLayoutOption();

  const { items, onAdd, onRemove, mapManaged, onReorder, latestCreatedKey } = useManager(focusedNode?.buttons ?? [], updateButtons, {
    factory: () => ({
      name: '',
      type: BaseButton.ButtonType.INTENT,
      payload: { intentID: null },
    }),
  });

  const usedIntentIDs = React.useMemo(
    () =>
      (focusedNode?.choices?.map((platformChoice) => getDistinctPlatformValue(platform, platformChoice).intent).filter(Boolean) as string[]) ?? [],
    [platform, focusedNode?.choices]
  );
  const dividedIntents = React.useMemo(() => {
    const usedIntents = intents.filter((intent) => usedIntentIDs.includes(intent.id));
    const unusedIntents = intents.filter((intent) => !usedIntentIDs.includes(intent.id));

    return [...(usedIntents.length ? [...usedIntents, createUIOnlyMenuItemOption('divider', { divider: true })] : []), ...unusedIntents];
  }, [intents, usedIntentIDs]);

  return (
    <Content
      anchor="How It Works"
      footer={({ scrollToBottom }) => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[buttonLayoutOption]} />}
          options={[
            {
              label: `Add ${getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'Chip' }, 'BaseButton')}`,
              onClick: Utils.functional.compose(() => scrollToBottom('smooth'), onAdd),
            },
          ]}
          tutorial={{ content: <HelpTooltip /> }}
          tutorialTitle={getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons')}
        />
      )}
      hideFooter={isDragging}
    >
      <DraggableList
        type="buttons-editor"
        onDelete={onRemove}
        onReorder={onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey, isOnlyItem: items.length === 1, dividedIntents }}
        mapManaged={mapManaged}
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

const focusedNodeWithButtonsSelector = createSelector(
  Creator.focusedNodeDataSelector,
  (data) => data as Realtime.NodeData<{ buttons?: BaseButton.AnyButton[]; choices?: Record<DistinctPlatform, Realtime.NodeData.InteractionChoice>[] }>
);

const mapStateToProps = {
  focus: Creator.creatorFocusSelector,
  intents: IntentV2.allPlatformIntentsSelector,
  focusedNode: focusedNodeWithButtonsSelector,
};

type ConnectedButtonPageProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Editor);
