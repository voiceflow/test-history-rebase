import * as Realtime from '@voiceflow/realtime-sdk';
import { IntentSlot } from '@voiceflow/realtime-sdk';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import OverflowMenu from '@/components/OverflowMenu';
import { getPlatformNewSlotsCreator } from '@/ducks/intent/utils';
import { MapManaged, useManager, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { CaptureSection, HelpTooltip } from './components';

const mapIntentSlots = (items: Realtime.IntentSlot[]) => items.map(({ id }) => id).filter(Boolean);

const CaptureEditor: NodeEditor<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = ({
  data,
  onChange,
  platform,
  pushToPath,
}) => {
  const [isDragging, toggleDragging] = useToggle(false);
  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });

  const slots = data.intent?.slots || [];
  const updateSlots = React.useCallback((slots: IntentSlot[]) => onChange({ intent: { slots } }), [onChange]);

  const { items, onAdd, onRemove, mapManaged, onReorder, latestCreatedKey } = useManager(slots, updateSlots, {
    factory: () => getPlatformNewSlotsCreator(platform)(''),
    autosave: false,
  });

  const dynamicSelectedSlotIDs = React.useMemo(() => mapIntentSlots(items), [items]);
  const selectedSlotIDs = React.useMemo(() => dynamicSelectedSlotIDs, [dynamicSelectedSlotIDs.join('')]);

  return (
    <Content
      footer={({ scrollToBottom }) => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[noReplyOption]} />}
          options={[
            {
              icon: 'capture',
              label: 'Add Capture',
              onClick: () => {
                onAdd();
                scrollToBottom();
              },
            },
          ]}
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
          }}
        />
      )}
      hideFooter={isDragging}
    >
      <DraggableList
        type="capture-v2-editor"
        onDelete={onRemove}
        onReorder={onReorder}
        itemProps={{ latestCreatedKey, isOnlyItem: items.length === 1, selectedSlotIDs }}
        mapManaged={mapManaged as MapManaged<IntentSlot>}
        itemComponent={CaptureSection}
        previewComponent={CaptureSection}
        partialDragItem
        onEndDrag={toggleDragging}
        onStartDrag={toggleDragging}
        deleteComponent={DeleteComponent}
        withContextMenuDelete
        withContextMenuDuplicate
        footer={<>{noReplySection}</>}
      />
    </Content>
  );
};

export default CaptureEditor;
