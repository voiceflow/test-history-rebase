import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import OverflowMenu from '@/components/OverflowMenu';
import { MapManaged, useManager, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { useIntentScope, useNoMatchOptionSection, useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { HelpTooltip } from '../components';
import { CaptureSection } from './components';

const mapIntentSlots = (items: Realtime.IntentSlot[]) => items.map(({ id }) => id).filter(Boolean);

const EntityCaptureEditor: NodeEditor<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = ({
  data,
  onChange,
  pushToPath,
  projectType,
}) => {
  const [isDragging, toggleDragging] = useToggle(false);

  const slots = data.intent?.slots || [];
  const updateSlots = React.useCallback((slots: Realtime.IntentSlot[]) => onChange({ intent: { slots } }), [onChange]);

  const queryCapture = () => {
    onChange({ captureType: BaseNode.CaptureV2.CaptureType.QUERY, noMatch: null });
  };

  const { items, onAdd, onRemove, mapManaged, onReorder, latestCreatedKey } = useManager(slots, updateSlots, {
    factory: () => Realtime.Utils.slot.intentSlotFactoryCreator(projectType)({ id: '' }),
    autosave: false,
  });

  const dynamicSelectedSlotIDs = React.useMemo(() => mapIntentSlots(items), [items]);
  const selectedSlotIDs = React.useMemo(() => dynamicSelectedSlotIDs, [dynamicSelectedSlotIDs.join('')]);

  const intentScopeOption = useIntentScope({ data, onChange });
  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });
  const [noMatchOption, noMatchSection] = useNoMatchOptionSection({ data, onChange, pushToPath });

  return (
    <Content
      footer={({ scrollToBottom }) => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[noMatchOption, noReplyOption, intentScopeOption]} />}
          options={[
            {
              icon: 'capture',
              label: 'Add Capture',
              disabled: data.captureType !== BaseNode.CaptureV2.CaptureType.INTENT,
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
        itemProps={{ latestCreatedKey, queryCapture, isOnlyItem: items.length === 1, selectedSlotIDs, pushToPath }}
        mapManaged={mapManaged as MapManaged<Realtime.IntentSlot>}
        itemComponent={CaptureSection}
        previewComponent={CaptureSection}
        partialDragItem
        onEndDrag={toggleDragging}
        onStartDrag={toggleDragging}
        deleteComponent={DeleteComponent}
        withContextMenuDelete
        footer={
          <>
            {noMatchSection}
            {noReplySection}
          </>
        }
      />
    </Content>
  );
};

export default EntityCaptureEditor;
